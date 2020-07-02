package controller

import (
	"encoding/json"
	"testing"

	"github.com/jinzhu/gorm"
	storymodel "github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/story"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
)

func TestGetStoryDetails(t *testing.T) {
	type QueryParams struct {
		Id int `url:"id"`
	}
	cases := []Testcase{
		{
			Title: "I can get story details by id",
			Db: map[string][]interface{}{
				"users": {
					&domain.User{Model: gorm.Model{ID: 1}, Username: "user1", Email: "e1", Phone: "p1", ImageURL: "image1",
						SocialLinks: `["link1", "link2"]`},
					&domain.User{Model: gorm.Model{ID: 2}, Username: "user2", Email: "e2", Phone: "p2", ImageURL: "image2"},
					&domain.User{Model: gorm.Model{ID: 3}, Username: "user3", Email: "e3", Phone: "p3", ImageURL: "image3"},
					&domain.User{Model: gorm.Model{ID: 4}, Username: "user4", Email: "e4", Phone: "p4", ImageURL: "image4"},
				},
				"stories": {
					&domain.Story{
						Model: gorm.Model{ID: 1}, UserID: 1, VideoUrl: "video1", Title: "story1", Description: "desc1",
						Categories: []domain.Category{{Model: gorm.Model{ID: 1}, Title: "category1"}, {Model: gorm.Model{ID: 2}, Title: "category2"}},
					},
					&domain.Story{
						Model: gorm.Model{ID: 2}, UserID: 1, VideoUrl: "video2", Title: "story2", Description: "desc2", HelpInstructions: "i2", Upvotes: 10, Downvotes: 3,
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
			Query: QueryParams{Id: 2},
			Expected: storymodel.Story{
				ID: 2, VideoUrl: "video2", Title: "story2", Description: "desc2", City: "city1", HelpInstructions: "i2", Categories: []string{"category2", "category3"},
				Username: "user1", Email: "e1", Phone: "p1", ImageURL: "image1", SocialLinks: []string{"link1", "link2"}, Upvotes: 10, Downvotes: 3,
			},
		},
	}

	RunCases(t, cases, "GET", "/story/details", func(data []byte) (interface{}, error) {
		var res storymodel.Story
		err := json.Unmarshal(data, &res)
		return res, err
	})
}
