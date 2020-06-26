package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	cfg "github.com/s-matyukevich/belarus-civil-rights-support/src/config"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"go.uber.org/zap"
)

type dbLoggerWrapper struct {
	logger *zap.Logger
}

func (l *dbLoggerWrapper) Print(v ...interface{}) {
	l.logger.Debug("DB query:", zap.String("query", fmt.Sprintln(v...)))
}

func Database(logger *zap.Logger, config *cfg.Config) gin.HandlerFunc {
	db, err := gorm.Open("mysql", config.Database.Url())
	if err != nil {
		logger.Fatal("Can't open DB connection", zap.Error(err))
	}
	db.SetLogger(&dbLoggerWrapper{logger: logger})
	db.LogMode(true)

	err = db.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s", config.Database.Database)).Error
	if err != nil {
		logger.Fatal("Can't create database", zap.Error(err))
	}

	db, err = gorm.Open("mysql", config.Database.UrlWithDB())
	if err != nil {
		logger.Fatal("Can't open DB connection", zap.Error(err))
	}

	RunMigrations(db, logger)

	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

func RunMigrations(db *gorm.DB, logger *zap.Logger) {
	err := db.AutoMigrate(&domain.Category{}, &domain.City{}, &domain.Story{}, &domain.User{}, &domain.Vote{}).Error
	if err != nil {
		logger.Fatal("Can't run migrations", zap.Error(err))
	}
	db.Model(&domain.Story{}).AddForeignKey("user_id", "users(id)", "RESTRICT", "RESTRICT")
	db.Model(&domain.Vote{}).AddForeignKey("user_id", "users(id)", "RESTRICT", "RESTRICT")
	db.Model(&domain.Vote{}).AddForeignKey("story_id", "stories(id)", "CASCADE", "CASCADE")
	db.Table("story_categories").AddForeignKey("story_id", "stories(id)", "CASCADE", "CASCADE")
	db.Table("story_categories").AddForeignKey("category_id", "categories(id)", "CASCADE", "CASCADE")
	db.Table("story_cities").AddForeignKey("city_id", "cities(id)", "CASCADE", "CASCADE")
	db.Table("story_cities").AddForeignKey("story_id", "stories(id)", "CASCADE", "CASCADE")
}
