package guard

import "testing"

func TestWords(t *testing.T) {
	if n := Words("one two three"); n != 3 {
		t.Errorf("got %d, want 3", n)
	}
	if n := Words("one ```curl -X GET https://example.com/a/b/c``` two"); n != 2 {
		t.Errorf("fenced block not excluded: got %d, want 2", n)
	}
}

func TestOverBudget(t *testing.T) {
	long := ""
	for i := 0; i < 200; i++ {
		long += "word "
	}
	if n, max, over := OverBudget("define", long); !over || n != 200 || max != 150 {
		t.Errorf("got n=%d max=%d over=%v, want over", n, max, over)
	}
	if _, _, over := OverBudget("define", "short answer"); over {
		t.Error("short answer should not be over budget")
	}
	if _, _, over := OverBudget("unknown-shape", long); over {
		t.Error("unknown shape has no budget, should never be over")
	}
}
