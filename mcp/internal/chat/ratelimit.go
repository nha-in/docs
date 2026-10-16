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
	return l.Deny(ip, at).Limit == ""
}

// Denial says why a request was refused: Limit is "minute" or "day", and
// RetryAfter is how long until that window opens again. A zero Denial is an
// allowed request.
type Denial struct {
	Limit      string
	RetryAfter time.Duration
	// Cap is the limit's size, for a message that can name it.
	Cap int
}

// Deny counts one request against ip's minute and day windows and returns
// why it was refused, or a zero Denial when it was allowed. The panel shows
// the reader which limit and how long to wait; before it could, every
// refusal reached them as "The assistant is unreachable".
func (l *Limiter) Deny(ip string, at time.Time) Denial {
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
	if b.dayCount >= l.perDay {
		y, m, d := at.UTC().Date()
		midnight := time.Date(y, m, d+1, 0, 0, 0, 0, time.UTC)
		return Denial{Limit: "day", RetryAfter: midnight.Sub(at), Cap: l.perDay}
	}
	if b.minuteCount >= l.perMin {
		return Denial{Limit: "minute", RetryAfter: b.minuteStart.Add(time.Minute).Sub(at), Cap: l.perMin}
	}
	b.minuteCount++
	b.dayCount++
	return Denial{}
}
