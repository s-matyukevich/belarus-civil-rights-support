package controller

import (
	"encoding/json"
	"fmt"
	"net/url"
	"regexp"

	"github.com/gin-contrib/sessions"
	"github.com/go-playground/validator/v10"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/profile"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
)

func GetProfile(ctx *Context) (interface{}, error) {
	session := sessions.Default(ctx.GinCtx)
	user_id := session.Get("user_id")
	if user_id == nil {
		return nil, fmt.Errorf("User unauthenicated")
	}

	user := domain.User{}
	err := ctx.Db.First(&user, user_id).Error
	if err != nil {
		return nil, err
	}
	model := profile.User{}
	utils.Map(&user, &model)
	model.SocialLinks = []string{}
	if user.SocialLinks != "" {
		err := json.Unmarshal([]byte(user.SocialLinks), &model.SocialLinks)
		if err != nil {
			return nil, err
		}
	}
	return model, nil
}

func SaveProfile(ctx *Context) (interface{}, error) {
	session := sessions.Default(ctx.GinCtx)
	user_id := session.Get("user_id")
	if user_id == nil {
		return nil, fmt.Errorf("User unauthenicated")
	}
	user := domain.User{}
	err := ctx.Db.First(&user, user_id).Error
	if err != nil {
		return nil, err
	}

	model := profile.User{}
	if err := ctx.GinCtx.Bind(&model); err != nil {
		return nil, err
	}
	ctx.Logger.Sugar().Debugw("Save profile input", "model", model)
	err = ctx.Validator.Struct(&model)
	res := api_models.Status{Errors: make(map[string]interface{})}
	if err != nil {
		errs := err.(validator.ValidationErrors)
		for _, e := range errs {
			res.Errors[e.Field()] = e.Translate(ctx.Translator)
		}
	}
	if model.Email != "" {
		emailRegexp := regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
		if !emailRegexp.MatchString(model.Email) {
			res.Errors["Email"] = "Некоректный емейл"
		}
	}
	if model.Phone != "" {
		phoneRegexp := regexp.MustCompile(`^(\+375|80)(29|25|44|33)(\d{3})(\d{2})(\d{2})$`)
		if !phoneRegexp.MatchString(model.Phone) {
			res.Errors["Phone"] = "Телефон должен иметь формат: +375(29|25|44|33)XXXXXXX"
		}
	}
	utils.Map(&model, &user)
	if model.SocialLinks != nil {
		filteredLinks := []string{}
		invalid := false
		errors := []string{}
		for _, link := range model.SocialLinks {
			if link == "" {
				continue
			}
			if !isValidUrl(link) {
				invalid = true
				errors = append(errors, "Некорректная ссылка")
			} else {
				errors = append(errors, "")
				filteredLinks = append(filteredLinks, link)
			}
		}
		if invalid {
			res.Errors["SocialLinks"] = errors
		}
		links, err := json.Marshal(filteredLinks)
		if err != nil {
			return nil, err
		}
		user.SocialLinks = string(links)
	}
	if len(res.Errors) > 0 {
		return res, nil
	}
	if err := ctx.Db.Save(&user).Error; err != nil {
		return nil, err
	}

	return api_models.Status{Success: "Изменения успешно сохранены"}, nil
}

func isValidUrl(toTest string) bool {
	_, err := url.ParseRequestURI(toTest)
	if err != nil {
		return false
	}

	u, err := url.Parse(toTest)
	if err != nil || u.Scheme == "" || u.Host == "" {
		return false
	}

	return true
}
