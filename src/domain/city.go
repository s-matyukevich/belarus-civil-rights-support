package domain

import "github.com/jinzhu/gorm"

type City struct {
	gorm.Model

	Title   string `gorm:"not null"`
	Stories []Story
}
