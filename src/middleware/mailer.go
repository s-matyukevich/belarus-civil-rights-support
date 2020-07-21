package middleware

import (
	"github.com/gin-gonic/gin"
	cfg "github.com/s-matyukevich/belarus-civil-rights-support/src/config"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/mail"
)

func Mailer(config *cfg.Config) gin.HandlerFunc {
	mailer := mail.NewMailer(&config.Mail)
	return func(c *gin.Context) {
		c.Set("mailer", mailer)
		c.Next()
	}
}
