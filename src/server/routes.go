package server

import (
	"github.com/gin-gonic/gin"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/controller"
)

func SetRoutes(router *gin.Engine) {
	router.GET("/home/stories", controller.GetStories)
}
