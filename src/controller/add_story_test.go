package controller

import (
	"encoding/json"
	"testing"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models"
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

	RunCases(t, cases, "GET", "/add-story/get", func(data []byte) (interface{}, error) {
		var res add_story.Model
		err := json.Unmarshal(data, &res)
		return res, err
	})
}

func TestSaveStory(t *testing.T) {
	zero := uint(0)
	cases := []Testcase{
		{
			Title:      "Validation works",
			AuthUserId: 1,
			Body:       add_story.Story{Title: "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"},
			Expected: api_models.Status{Errors: []string{
				"Длинна поля превышает максимально допустимое значение 500 символов",
				"Поле не может быть пустым",
				"Поле не может быть пустым",
				"Поле не может быть пустым",
				"Поле не может быть пустым",
			}},
		},
		{
			Title:      "I can create a story",
			AuthUserId: 1,
			Db: map[string][]interface{}{
				"users": {
					&domain.User{Model: gorm.Model{ID: 1}, Username: "user1"},
				},
				"categories": {
					&domain.Category{Model: gorm.Model{ID: 1}, Title: "category1"},
					&domain.Category{Model: gorm.Model{ID: 2}, Title: "category2"},
					&domain.Category{Model: gorm.Model{ID: 3}, Title: "category3"},
				},
			},
			Body:     add_story.Story{Title: "title", Description: "description", VideoUrl: "video", HelpInstructions: "instructions", Categories: []uint{1, 3}},
			Expected: api_models.Status{Success: "История успешно сохранена"},
			ExpectedDb: map[string][]interface{}{
				"users": {
					domain.User{Model: gorm.Model{ID: 1}, Username: "user1"},
				},
				"categories": {
					domain.Category{Model: gorm.Model{ID: 1}, Title: "category1"},
					domain.Category{Model: gorm.Model{ID: 2}, Title: "category2"},
					domain.Category{Model: gorm.Model{ID: 3}, Title: "category3"},
				},
				"stories": {
					domain.Story{Model: gorm.Model{ID: 1}, Title: "title", Description: "description", VideoUrl: "video", HelpInstructions: "instructions", CityID: &zero, UserID: 1},
				},
				"story_categories": {
					[]interface{}{int64(1), int64(1)},
					[]interface{}{int64(3), int64(1)},
				},
			},
		},
		{
			Title:      "I can edit a story",
			AuthUserId: 1,
			Db: map[string][]interface{}{
				"users": {
					&domain.User{Model: gorm.Model{ID: 1}, Username: "user1"},
				},
				"stories": {
					&domain.Story{
						Model: gorm.Model{ID: 1}, UserID: 1, VideoUrl: "video1", Title: "story1", Description: "desc1",
						Categories: []domain.Category{{Model: gorm.Model{ID: 1}, Title: "category1"}, {Model: gorm.Model{ID: 2}, Title: "category2"}},
					},
				},
				"categories": {
					&domain.Category{Model: gorm.Model{ID: 3}, Title: "category3"},
				},
			},
			Body:     add_story.Story{ID: 1, Title: "title", Description: "description", VideoUrl: "video", HelpInstructions: "instructions", Categories: []uint{1, 3}},
			Expected: api_models.Status{Success: "История успешно сохранена"},
			ExpectedDb: map[string][]interface{}{
				"categories": {
					domain.Category{Model: gorm.Model{ID: 1}, Title: "category1"},
					domain.Category{Model: gorm.Model{ID: 2}, Title: "category2"},
					domain.Category{Model: gorm.Model{ID: 3}, Title: "category3"},
				},
				"stories": {
					domain.Story{Model: gorm.Model{ID: 1}, Title: "title", Description: "description", VideoUrl: "video", HelpInstructions: "instructions", CityID: &zero, UserID: 1},
				},
				"story_categories": {
					[]interface{}{int64(1), int64(1)},
					[]interface{}{int64(3), int64(1)},
				},
			},
		},
	}

	RunCases(t, cases, "POST", "/add-story/save", func(data []byte) (interface{}, error) {
		var res api_models.Status
		err := json.Unmarshal(data, &res)
		return res, err
	})
}
