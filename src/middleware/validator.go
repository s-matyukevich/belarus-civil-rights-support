package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
)

func Validator() gin.HandlerFunc {
	en := en.New()
	uni := ut.New(en, en)

	trans, _ := uni.GetTranslator("ru")

	validate := validator.New()
	en_translations.RegisterDefaultTranslations(validate, trans)

	return func(c *gin.Context) {
		c.Set("validator", validate)
		c.Next()
	}
}
