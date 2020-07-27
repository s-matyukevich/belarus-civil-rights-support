package master

//API models common to all pages, because they are handled on the master page

type CurrentUser struct {
	ID       uint
	Username string
	ImageURL string
}

type ContactUs struct {
	Message string `validate:"required,max=20000"`
	Email   string `validate:"required,max=255,email"`
}
