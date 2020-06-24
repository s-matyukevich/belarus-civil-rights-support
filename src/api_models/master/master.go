package master

//API models common to all pages, because they are handled on the master page

type CurrentUser struct {
	Id       uint
	Username string
	ImageURL string
}
