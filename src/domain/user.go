package domain

import "time"

type User struct {
	Id        uint `gorm:"primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Username        string
	OAuthProvider   string  // FB, VK, etc I plan to support only login through social networks.
	OAuthProviderId string  // OAuth provider unique id. Because we never login with password we don't need to store password hash
	Role            string  // User or Admin - everybody will be just "User" for now
	Email           string  `gorm:"unique_index"`
	Phone           string  `gorm:"unique_index"`
	ImageURL        string  // I plan to store the image in a public read-only S3 bucket
	SocialLinks     string  // I want to serialize the list of social links and store them as JSON. We don't need a foreign key there because links are never shares between users
	City            City    // one-to-many
	Stories         []Story `gorm:"ForeignKey:UserId"` // many-to-one
}
