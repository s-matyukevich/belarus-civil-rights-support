package controller

import (
	"net/http"
	"text/template"

	"github.com/gin-gonic/gin"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	"github.com/jinzhu/gorm"
	"github.com/langaner/crawlerdetector"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/config"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/mail"
	"go.uber.org/zap"
)

type Context struct {
	Db         *gorm.DB
	Logger     *zap.Logger
	Validator  *validator.Validate
	Translator ut.Translator
	GinCtx     *gin.Context
	Config     *config.Config
	Mailer     *mail.Mailer
}

type HandlerFunc func(*Context) (interface{}, error)

func wrapper(f HandlerFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := getContxt(c)

		obj, err := f(ctx)
		if err != nil {
			ctx.Logger.Warn("Error while processing request", zap.Error(err))
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		} else if obj != nil {
			c.JSON(http.StatusOK, obj)
		}
	}
}

func getContxt(c *gin.Context) *Context {
	return &Context{
		Db:         c.MustGet("db").(*gorm.DB),
		Logger:     c.MustGet("logger").(*zap.Logger),
		Validator:  c.MustGet("validator").(*validator.Validate),
		Translator: c.MustGet("translator").(ut.Translator),
		Config:     c.MustGet("config").(*config.Config),
		Mailer:     c.MustGet("mailer").(*mail.Mailer),
		GinCtx:     c,
	}
}

func SetRoutes(router *gin.Engine) {
	router.GET("/get-login-providers", wrapper(GetLoginProviders))
	router.GET("/oauth-callback", wrapper(OauthCallback))
	router.GET("/logged-user", wrapper(GetCurrentUser))
	router.GET("/logout", wrapper(Logout))
	router.POST("/vote", wrapper(Vote))
	router.GET("/get-cities", wrapper(GetCities))
	router.GET("/get-categories", wrapper(GetCategories))

	router.GET("/home/stories", wrapper(GetStories))

	router.GET("/add-story/get", wrapper(GetStory))
	router.POST("/add-story/save", wrapper(SaveStory))

	router.GET("/get-story-details/:id", wrapper(GetStoryDetails))
	router.POST("/submit-payment", wrapper(ProcessPayment))

	router.GET("/profile/get", wrapper(GetProfile))
	router.POST("/profile/save", wrapper(SaveProfile))

	router.GET("/get-my-stories", wrapper(MyStories))
	router.POST("/delete-my-stories", wrapper(DeleteStory))
}

func SetUIRoutes(router *gin.Engine, registerStatic bool) {
	uiRotes := map[string]HandlerFunc{
		"/add-story":      nil,
		"/edit-story/:id": nil,
		"/story/:id":      GetStoryDetails,
		"/profile":        nil,
		"/my-stories":     nil,
		"/privacy-policy": nil,
		"/":               nil,
	}
	templates := map[string]*template.Template{
		"/story/:id": template.Must(template.ParseFiles("templates/story.html")),
	}
	for r, handler := range uiRotes {
		registerUIHandler(router, r, handler, templates[r], registerStatic)
	}
}

func registerUIHandler(router *gin.Engine, r string, handler HandlerFunc, tmpl *template.Template, registerStatic bool) {
	router.GET(r, func(c *gin.Context) {
		ctx := getContxt(c)
		detector := crawlerdetector.New()
		ctx.Logger.Debug("User-agent", zap.String("agent", c.Request.Header.Get("User-Agent")))
		isCrawler := detector.IsCrawler(c.Request.Header.Get("User-Agent"))
		if handler != nil && isCrawler {
			obj, err := handler(ctx)
			if err != nil {
				ctx.Logger.Warn("Error while processing request", zap.Error(err))
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			ctx.Logger.Debug("Prerendering metadata")
			tmpl.Execute(c.Writer, obj)
			return
		}
		if registerStatic {
			c.File("static/index.html")
			return
		}
		c.String(404, "not found")
	})
}
