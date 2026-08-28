package chat

import (
	"sync"
	"time"
)

type bucket struct {
	minuteStart time.Time
	minuteCount int
	day         string // "2026-08-27" in UTC
	dayCount    int
}

type Limiter struct {
	perMin, perDay int
	mu             sync.Mutex
	buckets        map[string]*bucket
	// lastSweep is when evictStale last actually ran, so it can be throttled
	// to at most once per minute even though Allow is called on every
	// request; a full map scan on every call would be wasted work once the
	// bucket count is large.
	lastSweep time.Time
}

func NewLimiter(perMin, perDay int) *Limiter {
	return &Limiter{perMin: perMin, perDay: perDay, buckets: map[string]*bucket{}}
}

// evictStale removes buckets that are stale on both axes: their minute
// window closed over a minute ago (so minuteCount no longer matters) and
// their day no longer matches at's UTC day (so dayCount no longer matters
// either). An entry only stale on one axis is kept, since it is still doing
// real rate-limiting work. Without this, an attacker who forges a fresh
// X-Forwarded-For value on every request grows the bucket map forever.
func (l *Limiter) evictStale(at time.Time) {
	if !l.lastSweep.IsZero() && at.Sub(l.lastSweep) < time.Minute {
		return
	}
	l.lastSweep = at
	today := at.UTC().Format("2006-01-02")
	for ip, b := range l.buckets {
		if at.Sub(b.minuteStart) > time.Minute && b.day != today {
			delete(l.buckets, ip)
		}
	}
}

func (l *Limiter) Allow(ip string, at time.Time) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.evictStale(at)
	b := l.buckets[ip]
	if b == nil {
		b = &bucket{}
		l.buckets[ip] = b
	}
	if at.Sub(b.minuteStart) >= time.Minute {
		b.minuteStart, b.minuteCount = at, 0
	}
	if d := at.UTC().Format("2006-01-02"); d != b.day {
		b.day, b.dayCount = d, 0
	}
	if b.minuteCount >= l.perMin || b.dayCount >= l.perDay {
		return false
	}
	b.minuteCount++
	b.dayCount++
	return true
}
