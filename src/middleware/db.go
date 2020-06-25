package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	cfg "github.com/s-matyukevich/belarus-civil-rights-support/src/config"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"go.uber.org/zap"
)

func Database(logger *zap.Logger, config *cfg.Config) gin.HandlerFunc {
	db, err := gorm.Open("mysql", config.Database.Url())
	if err != nil {
		logger.Fatal("Can't open DB connection", zap.Error(err))
	}

	err = db.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s", config.Database.Database)).Error
	if err != nil {
		logger.Fatal("Can't create database", zap.Error(err))
	}

	db, err = gorm.Open("mysql", config.Database.UrlWithDB())
	if err != nil {
		logger.Fatal("Can't open DB connection", zap.Error(err))
	}

	err = db.AutoMigrate(&domain.Category{}, &domain.City{}, &domain.Story{}, &domain.User{}).Error
	if err != nil {
		logger.Fatal("Can't run migrations", zap.Error(err))
	}

	return func(c *gin.Context) {
		c.Set("DB", db)
		c.Next()
	}
}
