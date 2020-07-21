package domain

import "github.com/jinzhu/gorm"

type Payment struct {
	gorm.Model
	Amount          int    `gorm:"not null"`
	Type            string `gorm:"not null"`
	Currency        string `gorm:"not null"`
	Contact         string
	ReferenceNumber string
	Story           Story
	StoryID         uint `gorm:"not null"`
}
