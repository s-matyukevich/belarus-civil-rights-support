package add_story

type CitiInfo struct {
	Id   uint
	Name string
}

type CategoryInfo struct {
	Id   uint
	Name string
}

type Story struct {
	Id               uint
	Title            string
	Description      string
	VideoURL         string
	HelpInstructions string
	Email            string // Still not sure whether we should associate contact infor with a person or a story
	Phone            string // For now, the idea is to store this info in the Users table but allow to edit it from the Add Story page
	SocialLinks      []string
	City             CitiInfo
	Categories       []CategoryInfo
}
