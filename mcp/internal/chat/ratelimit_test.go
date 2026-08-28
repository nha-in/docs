package chat

import (
	"testing"
	"time"
)

func TestLimiterMinuteWindow(t *testing.T) {
	l := NewLimiter(2, 100)
	base := time.Date(2026, 8, 27, 10, 0, 0, 0, time.UTC)
	if !l.Allow("1.2.3.4", base) || !l.Allow("1.2.3.4", base.Add(time.Second)) {
		t.Fatal("first two must pass")
	}
	if l.Allow("1.2.3.4", base.Add(2*time.Second)) {
		t.Fatal("third within the minute must fail")
	}
	if !l.Allow("1.2.3.4", base.Add(61*time.Second)) {
		t.Fatal("next minute must pass")
	}
	if !l.Allow("5.6.7.8", base.Add(2*time.Second)) {
		t.Fatal("other ip unaffected")
	}
}

func TestLimiterDayBoundary(t *testing.T) {
	l := NewLimiter(1000, 3)
	day := time.Date(2026, 8, 27, 23, 59, 0, 0, time.UTC)
	for i := 0; i < 3; i++ {
		if !l.Allow("1.2.3.4", day.Add(time.Duration(-i)*time.Hour)) {
			t.Fatalf("request %d must pass", i)
		}
	}
	if l.Allow("1.2.3.4", day) {
		t.Fatal("fourth of the day must fail")
	}
	if !l.Allow("1.2.3.4", day.Add(2*time.Minute)) {
		t.Fatal("next UTC day must pass")
	}
}

func TestLimiterEvictsStaleBuckets(t *testing.T) {
	// A forged X-Forwarded-For value per request must not grow the bucket
	// map forever: once a bucket is stale on both its minute and day
	// windows, the next Allow call anywhere sweeps it out.
	l := NewLimiter(10, 10)
	day1 := time.Date(2026, 8, 27, 10, 0, 0, 0, time.UTC)
	l.Allow("1.2.3.4", day1)
	l.Allow("5.6.7.8", day1)
	if len(l.buckets) != 2 {
		t.Fatalf("buckets = %d, want 2", len(l.buckets))
	}
	// Well past both the minute and the UTC day boundary: the two buckets
	// above are now stale on both axes and must be swept before this call's
	// own bucket is created.
	day2 := day1.Add(25 * time.Hour)
	l.Allow("9.9.9.9", day2)
	if _, ok := l.buckets["1.2.3.4"]; ok {
		t.Error("stale bucket for 1.2.3.4 not evicted")
	}
	if _, ok := l.buckets["5.6.7.8"]; ok {
		t.Error("stale bucket for 5.6.7.8 not evicted")
	}
	if len(l.buckets) != 1 {
		t.Errorf("buckets = %d, want 1 (only 9.9.9.9 left)", len(l.buckets))
	}
}

func TestLimiterKeepsBucketsStillWithinTheDay(t *testing.T) {
	// A bucket idle for over a minute but still within the same UTC day is
	// stale on only one axis (the minute window) and must survive the
	// sweep: its dayCount is still meaningful rate-limiting state.
	l := NewLimiter(10, 2)
	base := time.Date(2026, 8, 27, 10, 0, 0, 0, time.UTC)
	l.Allow("1.2.3.4", base)
	// Force a sweep well over a minute later, same day.
	l.Allow("5.6.7.8", base.Add(90*time.Second))
	if _, ok := l.buckets["1.2.3.4"]; !ok {
		t.Fatal("bucket for 1.2.3.4 evicted while still within its day, want kept")
	}
	// The surviving dayCount must still be enforced.
	if !l.Allow("1.2.3.4", base.Add(91*time.Second)) {
		t.Fatal("second request of the day must pass")
	}
	if l.Allow("1.2.3.4", base.Add(92*time.Second)) {
		t.Fatal("third request of the day must fail (dayCount survived the sweep)")
	}
}
