package controller

import (
	"encoding/json"
	"testing"

	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/common"

	"github.com/jinzhu/gorm"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
)

func TestVote(t *testing.T) {
	cases := []Testcase{
		{
			Title:      "I can vote",
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
			},
			Body:     common.Vote{StoryID: 1, IsUpvote: true},
			Expected: common.VoteRes{Upvotes: 1, Downvotes: 0},
			ExpectedDb: map[string][]interface{}{
				"users": {
					domain.User{Model: gorm.Model{ID: 1}, Username: "user1"},
				},
				"stories": {
					domain.Story{
						Model: gorm.Model{ID: 1}, UserID: 1, VideoUrl: "video1", Title: "story1", Description: "desc1", Upvotes: 1, Rating: 1,
					},
				},
			},
		},
	}

	RunCases(t, cases, "POST", "/vote", func(data []byte) (interface{}, error) {
		var res common.VoteRes
		err := json.Unmarshal(data, &res)
		return res, err
	})
}
