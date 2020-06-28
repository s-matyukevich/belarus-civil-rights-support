package domain

import "github.com/jinzhu/gorm"

type Vote struct {
	gorm.Model

	IsUpvote bool
	User     User
	UserID   uint
	Story    Story
	StoryID  uint
}
