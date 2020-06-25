package server

import (
	"github.com/gin-gonic/gin"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/controller"
)

func GetRouter() *gin.Engine {
	router := gin.Default()

	router.GET("/home/stories", controller.GetStories)
	return router
}
