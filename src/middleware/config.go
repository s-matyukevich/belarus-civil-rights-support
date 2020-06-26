package middleware

import (
	"github.com/gin-gonic/gin"
	cfg "github.com/s-matyukevich/belarus-civil-rights-support/src/config"
)

func Config(config *cfg.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("config", config)
		c.Next()
	}
}
