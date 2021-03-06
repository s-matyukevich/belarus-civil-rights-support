package profile

type User struct {
	ID          uint
	Username    string `validate:"required,max=255"`
	ImageURL    string
	Email       string `validate:"max=255,omitempty,email"`
	Phone       string `validate:"max=255"`
	SocialLinks []string
}
