package controller

import (
	"encoding/json"
	"testing"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/home"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
)

func TestGetStories(t *testing.T) {
	cases := []Testcase{
		{
			Title: "I can query stories sorted by rating",
			Db: map[string][]interface{}{
				"users": {
					&domain.User{Model: gorm.Model{ID: 1}, Username: "user1", Email: "e1", Phone: "p1", ImageURL: "image1"},
					&domain.User{Model: gorm.Model{ID: 2}, Username: "user2", Email: "e2", Phone: "p2", ImageURL: "image2"},
				},
				"stories": {
					&domain.Story{Model: gorm.Model{ID: 1}, UserID: 1, VideoUrl: "video1", Title: "story1", Description: "desc1", Upvotes: 3, Downvotes: 2, Rating: 1},
					&domain.Story{Model: gorm.Model{ID: 2}, UserID: 1, VideoUrl: "video2", Title: "story2", Description: "desc2", Upvotes: 5, Downvotes: 1, Rating: 4},
					&domain.Story{Model: gorm.Model{ID: 3}, UserID: 2, VideoUrl: "video3", Title: "story3", Description: "desc3", Upvotes: 6, Downvotes: 4, Rating: 2},
				},
			},
			Query: home.Filters{SortColumn: "rating", SortDirection: "DESC"},
			Expected: []home.Story{
				home.Story{ID: 2, VideoUrl: "video2", Title: "story2", Description: "desc2", Upvotes: 5, Downvotes: 1, AuthorName: "user1", AuthorId: 1, AthorImageURL: "image1"},
				home.Story{ID: 3, VideoUrl: "video3", Title: "story3", Description: "desc3", Upvotes: 6, Downvotes: 4, AuthorName: "user2", AuthorId: 2, AthorImageURL: "image2"},
				home.Story{ID: 1, VideoUrl: "video1", Title: "story1", Description: "desc1", Upvotes: 3, Downvotes: 2, AuthorName: "user1", AuthorId: 1, AthorImageURL: "image1"},
			},
		},
		{
			Title: "I can filter by story title or description",
			Db: map[string][]interface{}{
				"users": {
					&domain.User{Model: gorm.Model{ID: 1}, Username: "user1", Email: "e1", Phone: "p1", ImageURL: "image1"},
					&domain.User{Model: gorm.Model{ID: 2}, Username: "user2", Email: "e2", Phone: "p2", ImageURL: "image2"},
				},
				"stories": {
					&domain.Story{Model: gorm.Model{ID: 1}, UserID: 1, VideoUrl: "video1", Title: "story1 search", Description: "desc1", Upvotes: 3, Downvotes: 2, Rating: 1},
					&domain.Story{Model: gorm.Model{ID: 2}, UserID: 1, VideoUrl: "video2", Title: "story2", Description: "desc2", Upvotes: 5, Downvotes: 1, Rating: 4},
					&domain.Story{Model: gorm.Model{ID: 3}, UserID: 2, VideoUrl: "video3", Title: "story3", Description: "desc3 search", Upvotes: 6, Downvotes: 4, Rating: 2},
				},
			},
			Query: home.Filters{SortColumn: "rating", SortDirection: "DESC", Search: "search"},
			Expected: []home.Story{
				home.Story{ID: 3, VideoUrl: "video3", Title: "story3", Description: "desc3 search", Upvotes: 6, Downvotes: 4, AuthorName: "user2", AuthorId: 2, AthorImageURL: "image2"},
				home.Story{ID: 1, VideoUrl: "video1", Title: "story1 search", Description: "desc1", Upvotes: 3, Downvotes: 2, AuthorName: "user1", AuthorId: 1, AthorImageURL: "image1"},
			},
		},
		{
			Title: "I can filter by cities and categories",
			Db: map[string][]interface{}{
				"users": {
					&domain.User{Model: gorm.Model{ID: 1}, Username: "user1", Email: "e1", Phone: "p1", ImageURL: "image1"},
					&domain.User{Model: gorm.Model{ID: 2}, Username: "user2", Email: "e2", Phone: "p2", ImageURL: "image2"},
				},
				"stories": {
					&domain.Story{
						Model: gorm.Model{ID: 1}, UserID: 1, VideoUrl: "video1", Title: "story1", Description: "desc1", Upvotes: 3, Downvotes: 2, Rating: 1,
						City: &domain.City{Model: gorm.Model{ID: 1}, Title: "city1"},
					},
					&domain.Story{
						Model: gorm.Model{ID: 2}, UserID: 1, VideoUrl: "video2", Title: "story2", Description: "desc2", Upvotes: 5, Downvotes: 1, Rating: 4,
						Categories: []domain.Category{{Model: gorm.Model{ID: 2}, Title: "category2"}},
						City:       &domain.City{Model: gorm.Model{ID: 1}, Title: "city1"},
					},
					&domain.Story{
						Model: gorm.Model{ID: 3}, UserID: 2, VideoUrl: "video3", Title: "story3", Description: "desc3", Upvotes: 6, Downvotes: 4, Rating: 2,
						Categories: []domain.Category{{Model: gorm.Model{ID: 5}, Title: "category5"}},
					},
				},
			},
			Query: home.Filters{SortColumn: "rating", SortDirection: "ASC", Cities: []int{1, 5}, Categories: []int{2, 5, 6}},
			Expected: []home.Story{
				home.Story{ID: 3, VideoUrl: "video3", Title: "story3", Description: "desc3", Upvotes: 6, Downvotes: 4, AuthorName: "user2", AuthorId: 2, AthorImageURL: "image2"},
				home.Story{ID: 2, VideoUrl: "video2", Title: "story2", Description: "desc2", Upvotes: 5, Downvotes: 1, AuthorName: "user1", AuthorId: 1, AthorImageURL: "image1"},
			},
		},
		{
			Title: "Pagination works",
			Db: map[string][]interface{}{
				"users": {
					&domain.User{Model: gorm.Model{ID: 1}, Username: "user1", Email: "e1", Phone: "p1", ImageURL: "image1"},
					&domain.User{Model: gorm.Model{ID: 2}, Username: "user2", Email: "e2", Phone: "p2", ImageURL: "image2"},
				},
				"stories": {
					&domain.Story{Model: gorm.Model{ID: 1}, UserID: 1, VideoUrl: "video", Title: "story", Description: "desc", Upvotes: 3, Downvotes: 2, Rating: 1},
					&domain.Story{Model: gorm.Model{ID: 2}, UserID: 1, VideoUrl: "video", Title: "story", Description: "desc", Upvotes: 5, Downvotes: 1, Rating: 4},
					&domain.Story{Model: gorm.Model{ID: 3}, UserID: 2, VideoUrl: "video", Title: "story", Description: "desc", Upvotes: 6, Downvotes: 4, Rating: 2},
					&domain.Story{Model: gorm.Model{ID: 4}, UserID: 2, VideoUrl: "video", Title: "story", Description: "desc", Upvotes: 6, Downvotes: 4, Rating: 3},
					&domain.Story{Model: gorm.Model{ID: 5}, UserID: 2, VideoUrl: "video", Title: "story", Description: "desc", Upvotes: 6, Downvotes: 4, Rating: 5},
				},
			},
			Query: home.Filters{SortColumn: "rating", SortDirection: "DESC", Page: 1},
			Expected: []home.Story{
				home.Story{ID: 4, VideoUrl: "video", Title: "story", Description: "desc", Upvotes: 6, Downvotes: 4, AuthorName: "user2", AuthorId: 2, AthorImageURL: "image2"},
				home.Story{ID: 3, VideoUrl: "video", Title: "story", Description: "desc", Upvotes: 6, Downvotes: 4, AuthorName: "user2", AuthorId: 2, AthorImageURL: "image2"},
			},
			Before: func() {
				PageSize = 2
			},
			After: func() {
				PageSize = 50
			},
		},
	}
	RunCases(t, cases, "GET", "/home/stories", func(data []byte) (interface{}, error) {
		var res []home.Story
		err := json.Unmarshal(data, &res)
		return res, err
	})
}
