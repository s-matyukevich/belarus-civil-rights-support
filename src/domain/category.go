package domain

import "github.com/jinzhu/gorm"

type Category struct {
	gorm.Model

	Title   string  `gorm:"not null"`
	Stories []Story `gorm:"many2many:story_categories;"`
}
