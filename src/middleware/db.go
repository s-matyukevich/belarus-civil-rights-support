package middleware

import (
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	cfg "github.com/s-matyukevich/belarus-civil-rights-support/src/config"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/storage"
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

	err = db.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci", config.Database.Database)).Error
	if err != nil {
		logger.Fatal("Can't create database", zap.Error(err))
	}

	db, err = gorm.Open("mysql", config.Database.UrlWithDB())
	if err != nil {
		logger.Fatal("Can't open DB connection", zap.Error(err))
	}
	db.SetLogger(&dbLoggerWrapper{logger: logger})
	db = db.LogMode(true)

	RunMigrations(db, logger)
	if config.PreloadData {
		logger.Info("Preloading data")
		PreloadData(db, config, logger)
	}
	//RewriteImageUrls(db, config, logger)

	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

func RunMigrations(db *gorm.DB, logger *zap.Logger) {
	err := db.AutoMigrate(&domain.Category{}, &domain.City{}, &domain.Story{}, &domain.User{}, &domain.Vote{}, &domain.Payment{}).Error
	if err != nil {
		logger.Fatal("Can't run migrations", zap.Error(err))
	}
	db.Model(&domain.Story{}).AddForeignKey("user_id", "users(id)", "RESTRICT", "RESTRICT")
	db.Model(&domain.Story{}).AddForeignKey("city_id", "cities(id)", "RESTRICT", "RESTRICT")
	db.Model(&domain.Vote{}).AddForeignKey("user_id", "users(id)", "RESTRICT", "RESTRICT")
	db.Model(&domain.Vote{}).AddForeignKey("story_id", "stories(id)", "CASCADE", "CASCADE")
	db.Model(&domain.Payment{}).AddForeignKey("story_id", "stories(id)", "CASCADE", "CASCADE")
	db.Table("story_categories").AddForeignKey("story_id", "stories(id)", "CASCADE", "CASCADE")
	db.Table("story_categories").AddForeignKey("category_id", "categories(id)", "CASCADE", "CASCADE")
}

func RewriteImageUrls(db *gorm.DB, config *cfg.Config, logger *zap.Logger) error {
	users := []domain.User{}
	err := db.Find(&users).Error
	if err != nil {
		return err
	}
	for _, user := range users {
		if strings.HasPrefix(user.ImageURL, "https://storage.googleapis.com") {
			continue
		}
		imageUrl, err := storage.SaveObjectToS3(user.ImageURL, user.OAuthProviderId, config)
		if err != nil {
			logger.Error("Can't update image url", zap.Error(err))
			continue
		}
		user.ImageURL = imageUrl
		err = db.Save(&user).Error
		if err != nil {
			return err
		}
	}
	return nil
}

func PreloadData(db *gorm.DB, config *cfg.Config, logger *zap.Logger) error {
	for table, items := range config.Data {
		dbItems := []struct{ Title string }{}
		err := db.Table(table).Select("title").Scan(&dbItems).Error
		if err != nil {
			return err
		}
		for _, item := range items {
			found := false
			for _, dbItem := range dbItems {
				if dbItem.Title == item {
					found = true
					break
				}
			}
			if !found {
				err = db.Exec(fmt.Sprintf("INSERT INTO %s (title)VALUES (?);", table), item).Error
				if err != nil {
					return err
				}
			}
		}
	}
	return nil
}
