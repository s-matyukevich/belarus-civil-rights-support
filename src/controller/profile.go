package controller

import (
	"encoding/json"
	"fmt"

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
	if err != nil {
		errs := err.(validator.ValidationErrors)
		res := api_models.Status{Errors: make(map[string]string)}
		for _, e := range errs {
			res.Errors[e.Field()] = e.Translate(ctx.Translator)
		}
		return res, nil
	}
	utils.Map(&model, &user)
	if err := ctx.Db.Save(&user).Error; err != nil {
		return nil, err
	}

	return api_models.Status{Success: "Изменения успешно сохранены"}, nil
}
