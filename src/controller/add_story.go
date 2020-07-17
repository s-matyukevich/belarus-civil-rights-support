package controller

import (
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/go-playground/validator/v10"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/add_story"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
)

func GetStory(ctx *Context) (interface{}, error) {
	idStr := ctx.GinCtx.Query("id")
	var id int
	var err error
	if id, err = strconv.Atoi(idStr); err != nil {
		return nil, fmt.Errorf("Invalid id: %s", idStr)
	}

	story := domain.Story{}
	err = ctx.Db.First(&story, id).Error
	if err != nil {
		return nil, err
	}
	model := add_story.Story{}
	utils.Map(&story, &model)
	if story.CityID != nil {
		model.CityID = story.CityID
	}

	categories := []domain.Category{}
	err = ctx.Db.Table("categories").
		Joins("LEFT JOIN story_categories ON story_categories.category_id = id").
		Where("story_categories.story_id = ?", story.ID).Find(&categories).Error
	if err != nil {
		return nil, err
	}
	for _, c := range categories {
		model.Categories = append(model.Categories, c.ID)
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
	res := api_models.Status{Errors: make(map[string]interface{})}
	if err != nil {
		errs := err.(validator.ValidationErrors)

		for _, e := range errs {
			res.Errors[e.Field()] = e.Translate(ctx.Translator)
		}
	}

	urlValidation := ""
	if _, ok := res.Errors["VideoUrl"]; !ok {
		if urlValidation = testUrl(model.VideoUrl); urlValidation != "" {
			res.Errors["VideoUrl"] = urlValidation
		}
	}

	if len(res.Errors) > 0 {
		return res, nil
	}

	story := domain.Story{}
	err = ctx.Db.FirstOrInit(&story, model.ID).Error
	if err != nil {
		return nil, err
	}
	utils.Map(&model, &story)
	if story.UserID != 0 && story.UserID != user_id.(uint) {
		user := domain.User{}
		err := ctx.Db.FirstOrInit(&user, user_id.(uint)).Error
		if err != nil {
			return nil, err
		}
		if user.Role != "admin" {
			return nil, fmt.Errorf("Trying to edit somebody elses's story")
		}
	}
	if story.UserID == 0 {
		story.UserID = user_id.(uint)
	}
	if model.CityID != nil && *model.CityID != 0 {
		story.CityID = model.CityID
	} else {
		story.CityID = nil
	}

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
	return api_models.Status{ID: story.ID, Success: "История успешно сохранена"}, nil
}

func testUrl(toTest string) string {
	if !strings.Contains(toTest, "youtube.com") {
		return "Адрес должен указывать на 'youtube.com'"
	}

	u, err := url.Parse(toTest)
	if err != nil || u.Scheme == "" || u.Host == "" {
		return "Некоректный адрес"
	}

	client := &http.Client{}
	res, err := client.Head(toTest)
	if err != nil {
		return "Видео не доступно. Проверьте адрес и убедитесь что видео находится в открытом доступе"
	}
	if res.StatusCode != 200 {
		return "Видео не доступно. Проверьте адрес и убедитесь что видео находится в открытом доступе"
	}

	return ""
}
