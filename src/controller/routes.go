package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/jinzhu/gorm"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/config"
	"go.uber.org/zap"
)

type Context struct {
	Db        *gorm.DB
	Logger    *zap.Logger
	Validator *validator.Validate
	GinCtx    *gin.Context
	Config    *config.Config
}

type HandlerFunc func(*Context) (interface{}, error)

func wrapper(f HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := &Context{
			Db:        c.MustGet("db").(*gorm.DB),
			Logger:    c.MustGet("logger").(*zap.Logger),
			Validator: c.MustGet("validator").(*validator.Validate),
			Config:    c.MustGet("config").(*config.Config),
			GinCtx:    c,
		}

		obj, err := f(ctx)
		if err != nil {
			ctx.Logger.Warn("Error while processing request", zap.Error(err))
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		} else if obj != nil {
			c.JSON(http.StatusOK, obj)
		}
	}
}

func SetRoutes(router *gin.Engine) {
	router.GET("/get-login-providers", wrapper(GetLoginProviders))
	router.GET("/oauth-callback", wrapper(OauthCallback))

	router.GET("/home/stories", wrapper(GetStories))
}
