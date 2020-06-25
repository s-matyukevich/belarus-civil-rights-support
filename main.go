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

	_ "github.com/jinzhu/gorm/dialects/mysql"
	cfg "github.com/s-matyukevich/belarus-civil-rights-support/src/config"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/middleware"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/server"
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
	logger, err := zap.NewProduction()
	if err != nil {
		fmt.Fprintf(os.Stderr, "error configuring logging: %v", err)
		os.Exit(1)
	}
	defer logger.Sync()

	config, err := cfg.LoadConfig(opts.config)
	if err != nil {
		logger.Fatal("Can't read config", zap.Error(err))
	}

	router := server.GetRouter()
	router.Use(middleware.Database(logger, config))

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
