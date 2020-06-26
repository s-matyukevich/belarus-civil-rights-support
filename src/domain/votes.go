package domain

import "github.com/jinzhu/gorm"

type Vote struct {
	gorm.Model

	IsUpvote int
	User     User
	UserID   uint
	Stoy     Story
	StoryID  uint
}
