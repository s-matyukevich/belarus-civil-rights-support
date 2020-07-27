package story

type Story struct {
	ID               uint
	Title            string
	Description      string
	VideoUrl         string
	VideoId          string
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
	Upvotes          int
	Downvotes        int
	PaymentEmail     string
	PhoneEnabled     bool
	PaymentPhone     string
	CardEnabled      bool
	CardLink         string
	CardRawEnabled   bool
	CardRaw          string
	MGEnabled        bool
	PaymentFirstName string
	PaymentLastName  string
	WUEnabled        bool
	PaymentAddress   string
}

type PaymentModel struct {
	StoryID         uint   `validate:"required"`
	Type            string `validate:"oneof=phone card cardraw mg wu"`
	Amount          string `validate:"required,numeric"`
	Currency        string `validate:"oneof=BYR USD"`
	Email           string `validate:"max=255,email"`
	ReferenceNumber string `validate:"max=255"`
}

type PaymentMailModel struct {
	Amount          string
	Currency        string
	Email           string
	ReferenceNumber string
	Username        string
	PaymentPhone    string
}
