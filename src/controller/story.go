package controller

import (
	"encoding/json"
	"strconv"

	"github.com/gin-contrib/sessions"
	storymodel "github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/story"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
)

func GetStoryDetails(ctx *Context) (interface{}, error) {
	strID := ctx.GinCtx.Query("id")
	id, err := strconv.Atoi(strID)
	if err != nil {
		return nil, err
	}

	story := domain.Story{}
	err = ctx.Db.First(&story, id).Error
	if err != nil {
		return nil, err
	}
	city := domain.City{}
	if story.CityID != nil {
		err := ctx.Db.First(&city, *story.CityID).Error
		if err != nil {
			return nil, err
		}
	}
	user := domain.User{}
	err = ctx.Db.First(&user, story.UserID).Error
	if err != nil {
		return nil, err
	}

	model := storymodel.Story{}
	utils.Map(&user, &model) //mapping fields from user first to prevent overriding ID field
	utils.Map(&story, &model)
	if story.CityID != nil {
		model.City = city.Title
	}
	if user.SocialLinks != "" {
		err := json.Unmarshal([]byte(user.SocialLinks), &model.SocialLinks)
		if err != nil {
			return nil, err
		}
	}

	categories := []domain.Category{}
	err = ctx.Db.Table("categories").
		Joins("LEFT JOIN story_categories ON story_categories.category_id = id").
		Where("story_categories.story_id = ?", id).Find(&categories).Error
	if err != nil {
		return nil, err
	}
	model.Categories = make([]string, 0)
	for _, c := range categories {
		model.Categories = append(model.Categories, c.Title)
	}
	session := sessions.Default(ctx.GinCtx)
	user_id := session.Get("user_id")
	if user_id != nil {
		vote := domain.Vote{}
		err = ctx.Db.Table("votes").Where("user_id = ? and story_id = ?", user_id.(uint), story.ID).FirstOrInit(&vote).Error
		if err != nil {
			return nil, err
		}
		if vote.ID != 0 {
			if vote.IsUpvote {
				model.UserUpvoted = true
			} else {
				model.UserDownvoted = true
			}
		}
	}

	return model, nil
}
