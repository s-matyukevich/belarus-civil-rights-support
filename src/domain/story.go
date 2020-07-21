package domain

import (
	"github.com/jinzhu/gorm"
)

type Story struct {
	gorm.Model

	VideoUrl         string     `gorm:"not null;size:500"` // We support just YouTube for now
	Title            string     `gorm:"not null;index;size:500"`
	Description      string     `gorm:"not null;type:text;size:20000"`
	HelpInstructions string     `gorm:"type:text;size:20000"`
	Upvotes          int        `gorm:"not null"` // Duplicating this info for faster and easier search
	Downvotes        int        `gorm:"not null"`
	Rating           int        `gorm:"not null;index"`
	Categories       []Category `gorm:"many2many:story_categories;"`
	Votes            []Vote
	City             *City
	CityID           *uint
	User             User
	IsDraft          bool
	UserID           uint `gorm:"not null"`
	PaymentEmail     string
	PhoneEnabled     bool
	PaymentPhone     string
	CardEnabled      bool
	CardLink         string
	MGEnabled        bool
	PaymentFirstName string
	PaymentLastName  string
	WUEnabled        bool
	PaymentAddress   string
}
