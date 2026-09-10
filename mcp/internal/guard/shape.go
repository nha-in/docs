package guard

// PackFacts is what a verifier needs from the passage pack: the flow
// titles it carried, and whether both ABHA identifiers were in play.
type PackFacts struct {
	FlowTitles          []string
	MentionsABHANumber  bool
	MentionsABHAAddress bool
}
