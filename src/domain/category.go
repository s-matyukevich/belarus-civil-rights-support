package domain

import "time"

type Category struct {
	Id        uint `gorm:"primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Title   string
	Stories []User `gorm:"ForeignKey:StoryId"` // many-to-many
}
