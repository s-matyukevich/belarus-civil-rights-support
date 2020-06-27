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
	Title            string `validate:"required,max=500"`
	Description      string `validate:"required,max=20000"`
	VideoUrl         string `validate:"required,max=500"`
	HelpInstructions string `validate:"required,max=20000"`
	CityID           uint
	Categories       []uint `validate:"required"`
}

type Model struct {
	Story      Story
	Cities     []CitiInfo
	Categories []CategoryInfo
}
