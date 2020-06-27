package controller

import (
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/add_story"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
)

func GetStory(ctx *Context) (interface{}, error) {
	id := ctx.GinCtx.Query("Id")

	story := domain.Story{}
	err := ctx.Db.First(&story, id).Error
	if err != nil {
		return nil, err
	}
	model := add_story.Model{}
	utils.Map(&story, &model.Story)
	if story.CityID != nil {
		model.Story.CityID = *story.CityID
	}

	categories := []domain.Category{}
	err = ctx.Db.Table("categories").
		Joins("LEFT JOIN story_categories ON story_categories.category_id = id").
		Where("story_categories.story_id = ?", id).Find(&categories).Error
	if err != nil {
		return nil, err
	}
	for _, c := range categories {
		model.Story.Categories = append(model.Story.Categories, c.ID)
	}

	cities := []domain.City{}
	err = ctx.Db.Find(&cities).Error
	if err != nil {
		return nil, err
	}
	for _, city := range cities {
		model.Cities = append(model.Cities, add_story.CitiInfo{ID: city.ID, Title: city.Title})
	}

	categories = []domain.Category{}
	err = ctx.Db.Find(&categories).Error
	if err != nil {
		return nil, err
	}
	for _, category := range categories {
		model.Categories = append(model.Categories, add_story.CategoryInfo{ID: category.ID, Title: category.Title})
	}

	return model, nil
}

func SaveStory(ctx *Context) (interface{}, error) {
	return nil, nil
}
