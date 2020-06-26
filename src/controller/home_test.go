package controller

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/go-querystring/query"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/home"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/middleware"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap/zaptest"
)

type testcase struct {
	title    string
	db       map[string][]interface{}
	request  home.Filters
	expected []home.Story
}

func TestGetStories(t *testing.T) {
	cases := []testcase{
		{
			title: "I can query stories sorted by rating",
			db: map[string][]interface{}{
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
			request: home.Filters{SortColumn: "rating", SortDirection: "DESC"},
			expected: []home.Story{
				home.Story{ID: 2, VideoUrl: "video2", Title: "story2", Description: "desc2", Upvotes: 5, Downvotes: 1, AuthorName: "user1", AuthorId: 1, AthorImageURL: "image1"},
				home.Story{ID: 3, VideoUrl: "video3", Title: "story3", Description: "desc3", Upvotes: 6, Downvotes: 4, AuthorName: "user2", AuthorId: 2, AthorImageURL: "image2"},
				home.Story{ID: 1, VideoUrl: "video1", Title: "story1", Description: "desc1", Upvotes: 3, Downvotes: 2, AuthorName: "user1", AuthorId: 1, AthorImageURL: "image1"},
			},
		},
		{
			title: "I can filter by story title or description",
			db: map[string][]interface{}{
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
			request: home.Filters{SortColumn: "rating", SortDirection: "DESC", Search: "search"},
			expected: []home.Story{
				home.Story{ID: 3, VideoUrl: "video3", Title: "story3", Description: "desc3 search", Upvotes: 6, Downvotes: 4, AuthorName: "user2", AuthorId: 2, AthorImageURL: "image2"},
				home.Story{ID: 1, VideoUrl: "video1", Title: "story1 search", Description: "desc1", Upvotes: 3, Downvotes: 2, AuthorName: "user1", AuthorId: 1, AthorImageURL: "image1"},
			},
		},
		{
			title: "I can filter by cities and categories",
			db: map[string][]interface{}{
				"users": {
					&domain.User{Model: gorm.Model{ID: 1}, Username: "user1", Email: "e1", Phone: "p1", ImageURL: "image1"},
					&domain.User{Model: gorm.Model{ID: 2}, Username: "user2", Email: "e2", Phone: "p2", ImageURL: "image2"},
				},
				"stories": {
					&domain.Story{
						Model: gorm.Model{ID: 1}, UserID: 1, VideoUrl: "video1", Title: "story1", Description: "desc1", Upvotes: 3, Downvotes: 2, Rating: 1,
						Cities: []domain.City{{Model: gorm.Model{ID: 1}, Title: "city1"}, {Model: gorm.Model{ID: 2}, Title: "city2"}},
					},
					&domain.Story{
						Model: gorm.Model{ID: 2}, UserID: 1, VideoUrl: "video2", Title: "story2", Description: "desc2", Upvotes: 5, Downvotes: 1, Rating: 4,
						Categories: []domain.Category{{Model: gorm.Model{ID: 2}, Title: "category1"}},
						Cities:     []domain.City{{Model: gorm.Model{ID: 1}, Title: "city1"}},
					},
					&domain.Story{
						Model: gorm.Model{ID: 3}, UserID: 2, VideoUrl: "video3", Title: "story3", Description: "desc3", Upvotes: 6, Downvotes: 4, Rating: 2,
						Categories: []domain.Category{{Model: gorm.Model{ID: 1}, Title: "category1"}},
						Cities:     []domain.City{{Model: gorm.Model{ID: 1}, Title: "city1"}},
					},
				},
			},
			request: home.Filters{SortColumn: "rating", SortDirection: "ASC", Cities: []int{1, 5}, Categories: []int{1, 5, 6}},
			expected: []home.Story{
				home.Story{ID: 3, VideoUrl: "video3", Title: "story3", Description: "desc3", Upvotes: 6, Downvotes: 4, AuthorName: "user2", AuthorId: 2, AthorImageURL: "image2"},
			},
		},
	}
	for _, tc := range cases {
		t.Run(tc.title, func(t *testing.T) {
			db, err := gorm.Open("sqlite3", "/tmp/test.db")
			db = db.Debug()
			assert.NoError(t, err)
			defer db.Close()
			logger := zaptest.NewLogger(t)
			middleware.RunMigrations(db, logger)
			router := gin.New()
			router.Use(gin.Recovery())
			router.Use(middleware.Logger(logger))
			router.Use(middleware.Validator())
			router.Use(func(c *gin.Context) {
				c.Set("db", db)
				c.Next()
			})
			SetRoutes(router)

			db.Exec("DELETE from users")
			db.Exec("DELETE from stories")
			db.Exec("DELETE from cities")
			db.Exec("DELETE from categories")
			db.Exec("DELETE from story_cities")
			db.Exec("DELETE from story_categories")
			for _, items := range tc.db {
				for _, item := range items {
					err := db.Create(item).Error
					assert.NoError(t, err)
				}
			}

			w := httptest.NewRecorder()
			v, err := query.Values(tc.request)
			assert.NoError(t, err)
			req, err := http.NewRequest("GET", "/home/stories?"+v.Encode(), nil)
			assert.NoError(t, err)
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusOK, w.Code)
			var res []home.Story
			json.Unmarshal(w.Body.Bytes(), &res)
			assert.Equal(t, tc.expected, res)
		})
	}
}
