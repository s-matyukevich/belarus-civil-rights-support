package common

type Vote struct {
	StoryID  uint
	IsUpvote bool
}

type VoteRes struct {
	UserUpvoted   bool
	UserDownvoted bool
	Upvotes       int
	Downvotes     int
}

type SelectItem struct {
	ID    uint
	Title string
}
