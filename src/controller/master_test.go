package controller

import (
	"encoding/json"
	"testing"

	"github.com/jinzhu/gorm"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/master"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
)

func TestGetCurrentUser(t *testing.T) {
	cases := []Testcase{
		{
			Title:      "I can get curently authenticated user",
			AuthUserId: 1,
			Db: map[string][]interface{}{
				"users": {
					&domain.User{Model: gorm.Model{ID: 1}, Username: "user1", Email: "e1", Phone: "p1", ImageURL: "image1"},
				},
			},
			Expected: master.CurrentUser{
				ID: 1, ImageURL: "image1", Username: "user1",
			},
		},
	}

	RunCases(t, cases, "GET", "/logged-user", func(data []byte) (interface{}, error) {
		var res master.CurrentUser
		err := json.Unmarshal(data, &res)
		return res, err
	})
}
