package controller

import (
	"encoding/json"

	storymodel "github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/story"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
)

func GetStoryDetails(ctx *Context) (interface{}, error) {
	id := ctx.GinCtx.Query("Id")

	story := domain.Story{}
	err := ctx.Db.First(&story, id).Error
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
	for _, c := range categories {
		model.Categories = append(model.Categories, c.Title)
	}
	return model, nil
}
