package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/go-playground/locales/en_US"
	"github.com/go-playground/locales/ru_RU"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
)

func Validator() gin.HandlerFunc {
	en := en_US.New()
	uni := ut.New(en, en, ru_RU.New())

	ru, _ := uni.GetTranslator("ru_RU")

	validate := validator.New()
	validate.RegisterTranslation("required", ru,
		func(ut ut.Translator) error {
			return ut.Add("required", "Поле не может быть пустым", false)
		},
		func(ut ut.Translator, fe validator.FieldError) string {
			t, err := ut.T(fe.Tag())
			if err != nil {
				return fe.(error).Error()
			}
			return t
		},
	)
	validate.RegisterTranslation("max", ru,
		func(ut ut.Translator) error {
			return ut.Add("max", "Длинна поля превышает максимально допустимое значение {0} символов", false)
		},
		func(ut ut.Translator, fe validator.FieldError) string {
			t, err := ut.T(fe.Tag(), fe.Param())
			if err != nil {
				return fe.(error).Error()
			}
			return t
		},
	)
	validate.RegisterTranslation("min", ru,
		func(ut ut.Translator) error {
			return ut.Add("min", "Выберите по крайней мере одну опцию", false)
		},
		func(ut ut.Translator, fe validator.FieldError) string {
			t, err := ut.T(fe.Tag(), fe.Param())
			if err != nil {
				return fe.(error).Error()
			}
			return t
		},
	)

	return func(c *gin.Context) {
		c.Set("validator", validate)
		c.Set("translator", ru)
		c.Next()
	}
}
