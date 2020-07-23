package controller

import (
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
