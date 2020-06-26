package domain

import "github.com/jinzhu/gorm"

type City struct {
	gorm.Model

	Title   string  `gorm:"not null"`
	Stories []Story `gorm:"many2many:story_cities;"`
}
