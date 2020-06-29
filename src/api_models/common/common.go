package common

type Vote struct {
	StoryID  uint
	IsUpvote bool
}

type VoteRes struct {
	Upvotes   int
	Downvotes int
}

type SelectItem struct {
	ID    uint
	Title string
}
