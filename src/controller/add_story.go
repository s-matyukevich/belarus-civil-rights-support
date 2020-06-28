package controller

import (
	"fmt"

	"github.com/gin-contrib/sessions"
	"github.com/go-playground/validator/v10"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models"
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
	session := sessions.Default(ctx.GinCtx)
	user_id := session.Get("user_id")
	if user_id == nil {
		return nil, fmt.Errorf("User unauthenicated")
	}
	model := add_story.Story{}
	if err := ctx.GinCtx.Bind(&model); err != nil {
		return nil, err
	}
	ctx.Logger.Sugar().Debugw("Save story input", "model", model)
	err := ctx.Validator.Struct(model)
	if err != nil {
		errs := err.(validator.ValidationErrors)
		res := api_models.Status{}
		for _, e := range errs {
			res.Errors = append(res.Errors, e.Translate(ctx.Translator))
		}
		return res, nil
	}

	story := domain.Story{}
	err = ctx.Db.FirstOrInit(&story, model.ID).Error
	if err != nil {
		return nil, err
	}
	utils.Map(&model, &story)
	if story.UserID != 0 && story.UserID != user_id.(uint) {
		return nil, fmt.Errorf("Trying to edit somebody elses's story")
	}
	story.UserID = user_id.(uint)
	story.CityID = &model.CityID

	//TODO: Add transaction
	if err := ctx.Db.Save(&story).Error; err != nil {
		return nil, err
	}
	if err := ctx.Db.Exec("DELETE FROM story_categories WHERE story_id = ?", story.ID).Error; err != nil {
		return nil, err
	}
	for _, c := range model.Categories {
		if err := ctx.Db.Exec("INSERT INTO story_categories (story_id, category_id) VALUES (?, ?)", story.ID, c).Error; err != nil {
			return nil, err
		}
	}
	return api_models.Status{Success: "История успешно сохранена"}, nil
}
