package story

type Story struct {
	ID               uint
	Title            string
	Description      string
	VideoUrl         string
	HelpInstructions string
	Username         string
	ImageURL         string
	Email            string
	Phone            string
	SocialLinks      []string
	City             string
	Categories       []string
	UserUpvoted      bool
	UserDownvoted    bool
	Upvotes          int // We probably should somehow combine youtube likes with our own likes
	Downvotes        int // Originally I thought about only using youtube likes, but a person who wishes to to like a story may not have a outube account
	// and it also makes it much harder to sort the stories by rating, so we probably should maintain our own likes
}
