package add_story

type CitiInfo struct {
	ID    uint
	Title string
}

type CategoryInfo struct {
	ID    uint
	Title string
}

type Story struct {
	ID               uint
	Title            string
	Description      string
	VideoUrl         string
	HelpInstructions string
	CityID           uint
	Categories       []uint
}

type Model struct {
	Story      Story
	Cities     []CitiInfo
	Categories []CategoryInfo
}
