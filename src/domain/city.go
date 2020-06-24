package domain

import "time"

type City struct {
	Id        uint `gorm:"primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Title string
	Users []User `gorm:"ForeignKey:CityId"` // many-to-one
}
