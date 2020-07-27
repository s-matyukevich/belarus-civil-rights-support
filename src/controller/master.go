package controller

import (
	"github.com/go-playground/validator/v10"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/master"

	"github.com/gin-contrib/sessions"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
)

func GetCurrentUser(ctx *Context) (interface{}, error) {
	session := sessions.Default(ctx.GinCtx)
	user_id := session.Get("user_id")
	if user_id == nil {
		//user is not
		return api_models.Status{Success: "User is not logged it"}, nil
	}

	user := domain.User{}
	err := ctx.Db.FirstOrInit(&user, user_id.(uint)).Error
	if err != nil {
		return nil, err
	}
	model := master.CurrentUser{}
	utils.Map(&user, &model)

	return model, nil
}

func ContactUs(ctx *Context) (interface{}, error) {
	model := master.ContactUs{}
	if err := ctx.GinCtx.Bind(&model); err != nil {
		return nil, err
	}
	err := ctx.Validator.Struct(model)
	res := api_models.Status{Errors: make(map[string]interface{})}
	if err != nil {
		errs := err.(validator.ValidationErrors)

		for _, e := range errs {
			res.Errors[e.Field()] = e.Translate(ctx.Translator)
		}
		return res, nil
	}
	err = ctx.Mailer.Send("Сообщение с сайта Дапамажы.by", "contact", model, ctx.Logger, ctx.Config.ContactEmail, model.Email)
	if err != nil {
		return nil, err
	}

	return api_models.Status{Success: "Ваше сообщение успешно отправлено"}, nil
}

// func GetCurrentBalance(ctx *Context) (interface{}, error) {
// 	c, err := paypalsdk.NewClient(ctx.Config.Paypal.Client, ctx.Config.Paypal.Secret, paypalsdk.APIBaseSandBox)
// 	if err != nil {
// 		return nil, err
// 	}
// 	c.SetLog(os.Stdout)

// 	payments, err := c.get()
// 	if err != nil {
// 		return nil, err
// 	}
// }
