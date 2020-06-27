package controller

import (
	"encoding/json"
	"testing"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/add_story"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
)

func TestGetStory(t *testing.T) {
	cases := []Testcase{
		{
			Title: "I can get story by id",
			Db: map[string][]interface{}{
				"users": {
					&domain.User{Model: gorm.Model{ID: 1}, Username: "user1", Email: "e1", Phone: "p1", ImageURL: "image1"},
				},
				"stories": {
					&domain.Story{
						Model: gorm.Model{ID: 1}, UserID: 1, VideoUrl: "video1", Title: "story1", Description: "desc1",
						Categories: []domain.Category{{Model: gorm.Model{ID: 1}, Title: "category1"}, {Model: gorm.Model{ID: 2}, Title: "category2"}},
					},
					&domain.Story{
						Model: gorm.Model{ID: 2}, UserID: 1, VideoUrl: "video2", Title: "story2", Description: "desc2",
						Categories: []domain.Category{{Model: gorm.Model{ID: 2}, Title: "category2"}, {Model: gorm.Model{ID: 3}, Title: "category3"}},
						City:       &domain.City{Model: gorm.Model{ID: 1}, Title: "city1"},
					},
					&domain.Story{
						Model: gorm.Model{ID: 3}, UserID: 1, VideoUrl: "video3", Title: "story3", Description: "desc3",
						Categories: []domain.Category{{Model: gorm.Model{ID: 3}, Title: "category3"}, {Model: gorm.Model{ID: 4}, Title: "category4"}},
						City:       &domain.City{Model: gorm.Model{ID: 2}, Title: "city2"},
					},
				},
			},
			Query: struct{ Id int }{Id: 2},
			Expected: add_story.Model{
				Story:      add_story.Story{ID: 2, VideoUrl: "video2", Title: "story2", Description: "desc2", CityID: 1, Categories: []uint{2, 3}},
				Cities:     []add_story.CitiInfo{{ID: 1, Title: "city1"}, {ID: 2, Title: "city2"}},
				Categories: []add_story.CategoryInfo{{ID: 1, Title: "category1"}, {ID: 2, Title: "category2"}, {ID: 3, Title: "category3"}, {ID: 4, Title: "category4"}},
			},
		},
	}

	RunCases(t, cases, "/add-story/get", func(data []byte) (interface{}, error) {
		var res add_story.Model
		err := json.Unmarshal(data, &res)
		return res, err
	})
}
