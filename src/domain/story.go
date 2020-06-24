package domain

import "time"

type Story struct {
	Id        uint `gorm:"primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time

	VideoUrl         string // We support just YouTybe for now
	Title            string
	Description      string
	HelpInstructions string
	Categories       []Category `gorm:"ForeignKey:UserId"` // many-to-many
}
