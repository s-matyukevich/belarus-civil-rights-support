package story

type Story struct {
	Id               uint
	Title            string
	Description      string
	VideoURL         string
	HelpInstructions string
	Email            string
	Phone            string
	SocialLinks      []string
	City             string
	Categories       []string
	Likes            int // We probably should somehow combine youtube likes with our own likes
	Dislikes         int // Originally I thought about only using youtube likes, but a person who wishes to to like a story may not have a outube account
	// so we probably should maintain our own likes
}
