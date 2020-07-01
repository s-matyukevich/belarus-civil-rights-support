package controller

import (
	"fmt"

	"github.com/jinzhu/gorm"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/home"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
)

var (
	PageSize = 50
)

func GetStories(ctx *Context) (interface{}, error) {
	var filters home.Filters
	if err := ctx.GinCtx.Bind(&filters); err != nil {
		return nil, err
	}
	ctx.Logger.Sugar().Debugw("Get stories input", "filters", filters)

	if filters.SortColumn == "" {
		filters.SortColumn = "rating"
	}
	if filters.SortDirection == "" {
		filters.SortDirection = "DESC"
	}

	err := ctx.Validator.Struct(filters)
	if err != nil {
		// return error because there should be mo way for the user to send imvalid input here
		return nil, err
	}

	query := ctx.Db.Table("stories")

	if filters.Search != "" {
		query = query.Where("title LIKE ? OR description LIKE ?", "%"+filters.Search+"%", "%"+filters.Search+"%")
	}
	if len(filters.Cities) > 0 {
		query = query.Where("city_id IN (?) OR city_id IS NULL", filters.Cities)
	}
	if len(filters.Categories) > 0 {
		query = query.
			Where("? > 0",
				ctx.Db.Table("story_categories").
					Select("COUNT(*)").
					Where("story_categories.story_id = stories.id AND story_categories.category_id IN (?)", filters.Categories).SubQuery())
	}
	query = query.Order(gorm.Expr(fmt.Sprintf("%s %s", filters.SortColumn, filters.SortDirection)))
	query = query.Limit(PageSize).Offset(filters.Page * PageSize)
	query = query.Preload("User")

	stories := []domain.Story{}
	err = query.Find(&stories).Error
	if err != nil {
		return nil, err
	}

	var ans []home.Story
	for _, story := range stories {
		var storyModel home.Story
		//map common fields
		utils.Map(&story, &storyModel)
		storyModel.AuthorId = story.User.ID
		storyModel.AuthorImageURL = story.User.ImageURL
		storyModel.AuthorName = story.User.Username
		ans = append(ans, storyModel)
	}

	return ans, nil
}
