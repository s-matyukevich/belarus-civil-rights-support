package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	cfg "github.com/s-matyukevich/belarus-civil-rights-support/src/config"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/controller"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/middleware"
	"go.uber.org/zap"
)

type options struct {
	config string
}

func initOptions() options {
	var opts options
	flag.StringVar(&opts.config, "config", "", "Config path")
	flag.Parse()
	return opts
}

func main() {

	opts := initOptions()
	logger, err := NewLoggerConfig().Build()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error configuring logging: %v", err)
		os.Exit(1)
	}
	defer logger.Sync()

	logger.Sugar().Infow("Args", "Args", os.Args)
	config, err := cfg.LoadConfig(opts.config)
	if err != nil {

		logger.Fatal("Can't read config", zap.Error(err), zap.String("configPath", opts.config))
	}
	router := gin.New()

	if config.AllowCors {
		router.Use(cors.Default())
	}

	router.Use(gin.Recovery())
	router.Use(middleware.Database(logger, config))
	router.Use(middleware.Logger(logger))
	router.Use(middleware.Validator())
	store := cookie.NewStore([]byte(config.SessionSecret))
	router.Use(sessions.Sessions("mainsession", store))
	router.Use(middleware.Config(config))
	controller.SetRoutes(router)
	if config.UIProxyDomain != "" {
		router.Use(middleware.ReverseProxy(config.UIProxyDomain))
		router.Use(static.Serve("/images", static.LocalFile("static/images", false)))
	} else {
		router.Use(static.Serve("/", static.LocalFile("static", false)))
	}

	srv := &http.Server{
		Addr:    ":" + strconv.Itoa(config.Port),
		Handler: router,
	}

	// Initializing the server in a goroutine so that
	// it won't block the graceful shutdown handling below
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	quit := make(chan os.Signal)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")
	// The context is used to inform the server it has 5 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}

func NewLoggerConfig() zap.Config {
	return zap.Config{
		Level:       zap.NewAtomicLevelAt(zap.DebugLevel),
		Development: false,
		Sampling: &zap.SamplingConfig{
			Initial:    100,
			Thereafter: 100,
		},
		Encoding:         "json",
		EncoderConfig:    zap.NewProductionEncoderConfig(),
		OutputPaths:      []string{"stderr"},
		ErrorOutputPaths: []string{"stderr"},
	}
}
