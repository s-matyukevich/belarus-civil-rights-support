package controller

import (
	"encoding/json"
	"net/url"
	"strconv"

	"github.com/gin-contrib/sessions"
	"github.com/go-playground/validator/v10"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models"
	storymodel "github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/story"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
	"go.uber.org/zap"
)

func GetStoryDetails(ctx *Context) (interface{}, error) {
	strID := ctx.GinCtx.Param("id")
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
	ctx.Logger.Debug("Parsing video url", zap.String("url", model.VideoUrl))
	url, err := url.Parse(model.VideoUrl)
	if err != nil {
		ctx.Logger.Error("Can't parse youtube video", zap.String("video", model.VideoUrl), zap.Error(err))
	} else {
		model.VideoId = url.Query().Get("v")
	}

	return model, nil
}

func ProcessPayment(ctx *Context) (interface{}, error) {
	model := storymodel.PaymentModel{}
	if err := ctx.GinCtx.Bind(&model); err != nil {
		return nil, err
	}
	ctx.Logger.Sugar().Debugw("ProcessPayment input", "model", model)
	err := ctx.Validator.Struct(model)
	res := api_models.Status{Errors: make(map[string]interface{})}
	if err != nil {
		errs := err.(validator.ValidationErrors)

		for _, e := range errs {
			res.Errors[e.Field()] = e.Translate(ctx.Translator)
		}
	}
	if (model.Type == "wu" || model.Type == "mg") && model.ReferenceNumber == "" {
		res.Errors["ReferenceNumber"] = "Поле не может быть пустым"
	}

	if len(res.Errors) > 0 {
		return res, nil
	}

	story := domain.Story{}
	err = ctx.Db.First(&story, model.StoryID).Error
	if err != nil {
		return nil, err
	}

	user := domain.User{}
	err = ctx.Db.First(&user, story.UserID).Error
	if err != nil {
		return nil, err
	}

	mailModel := storymodel.PaymentMailModel{}
	utils.Map(&model, &mailModel)
	utils.Map(&story, &mailModel)
	utils.Map(&user, &mailModel)

	err = ctx.Mailer.Send("Вам поступил новый платеж", model.Type, mailModel, ctx.Logger, story.PaymentEmail)
	if err != nil {
		return nil, err
	}

	payment := domain.Payment{}
	utils.Map(&model, &payment)
	payment.Amount, err = strconv.Atoi(model.Amount)
	if err != nil {
		return nil, err
	}
	if err := ctx.Db.Save(&payment).Error; err != nil {
		return nil, err
	}

	return api_models.Status{Success: "Ваш платеж принят, спасибо!"}, nil
}
