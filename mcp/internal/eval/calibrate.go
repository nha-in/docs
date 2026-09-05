package eval

// Agreement counts how often the judge's grade equals the owner's, over the
// cases the owner graded. An unstable judge grade never agrees. The judge
// ships at 85 percent or better; below that the rubric is wrong, not the
// owner.
func Agreement(owner map[string]string, judge []Grade) (agree, total int) {
	by := map[string]string{}
	for _, g := range judge {
		by[g.CaseID] = g.Grade
	}
	for id, want := range owner {
		if want == "" {
			continue
		}
		total++
		if by[id] == want {
			agree++
		}
	}
	return agree, total
}
