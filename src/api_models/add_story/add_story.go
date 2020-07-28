package add_story

type Story struct {
	ID               uint
	Title            string `validate:"required,max=500"`
	Description      string `validate:"required,max=20000"`
	VideoUrl         string `validate:"required,max=500"`
	HelpInstructions string `validate:"max=20000"`
	CityID           *uint
	IsDraft          bool
	Categories       []uint `validate:"required,min=1"`
	PaymentEmail     string `validate:"required_with=PhoneEnabled CardEnabled CardRawEnabled MGEnabled WUEnabled,max=255,omitempty,email"`
	PhoneEnabled     bool
	PaymentPhone     string `validate:"required_with=PhoneEnabled,max=255"`
	CardEnabled      bool
	CardLink         string `validate:"required_with=CardEnabled,max=255,omitempty,url"`
	CardRawEnabled   bool
	CardRaw          string `validate:"required_with=CardRawEnabled,max=255"`
	MGEnabled        bool
	PaymentFirstName string `validate:"required_with=MGEnabled WUEnabled,max=255"`
	PaymentLastName  string `validate:"required_with=MGEnabled WUEnabled,max=255"`
	WUEnabled        bool
	PaymentAddress   string `validate:"max=255"`
}
