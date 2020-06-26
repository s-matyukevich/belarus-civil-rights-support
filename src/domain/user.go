package domain

import "github.com/jinzhu/gorm"

type User struct {
	gorm.Model

	Username        string `gorm:"not null;index"`
	OAuthProvider   string `gorm:"not null"` // FB, VK, etc I plan to support only login through social networks.
	OAuthProviderId string `gorm:"not null"` // OAuth provider unique id. Because we never login with password we don't need to store password hash
	Role            string `gorm:"not null"` // User or Admin - everybody will be just "User" for now
	Email           string `gorm:"unique_index"`
	Phone           string `gorm:"unique_index"`
	ImageURL        string `gorm:"size:500"`             // I plan to store the image in a public read-only S3 bucket
	SocialLinks     string `gorm:"type:text;size:10000"` // I want to serialize the list of social links and store them as JSON. We don't need a foreign key there because links are never shares between users
	Stories         []Story
	Votes           []Vote
}
