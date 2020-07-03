package controller

import (
	"fmt"
	"strconv"

	"github.com/gin-contrib/sessions"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/my_stories"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
)

func MyStories(ctx *Context) (interface{}, error) {
	session := sessions.Default(ctx.GinCtx)
	user_id := session.Get("user_id")
	if user_id == nil {
		return nil, fmt.Errorf("User unauthenticated")
	}

	stories := []domain.Story{}
	err := ctx.Db.Table("stories").Where("user_id = ?", user_id.(uint)).Find(&stories).Error
	if err != nil {
		return nil, err
	}

	ans := []my_stories.StoryInfo{}
	for _, story := range stories {
		model := my_stories.StoryInfo{}
		utils.Map(&story, &model)
		ans = append(ans, model)
	}
	return ans, nil
}

func DeleteStory(ctx *Context) (interface{}, error) {
	session := sessions.Default(ctx.GinCtx)
	user_id := session.Get("user_id")
	if user_id == nil {
		return nil, fmt.Errorf("User unauthenticated")
	}

	strID := ctx.GinCtx.Query("id")
	id, err := strconv.Atoi(strID)
	if err != nil {
		return nil, err
	}

	story := domain.Story{}
	err = ctx.Db.First(&story, id).Error
	if err != nil {
		return nil, err
	}

	err = ctx.Db.Delete(&story).Error
	if err != nil {
		return nil, err
	}

	return api_models.Status{Success: "История успешно удалена"}, nil
}
