package controller

import (
	"fmt"

	"github.com/gin-contrib/sessions"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models/common"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
)

func Vote(ctx *Context) (interface{}, error) {
	model := common.Vote{}
	if err := ctx.GinCtx.Bind(&model); err != nil {
		return nil, err
	}

	session := sessions.Default(ctx.GinCtx)
	user_id := session.Get("user_id")
	if user_id == nil {
		return nil, fmt.Errorf("User is unauthenticated")
	}

	//We check that both user and story with the provided IDs are present in the DB
	user := domain.User{}
	err := ctx.Db.First(&user, user_id.(uint)).Error
	if err != nil {
		return nil, err
	}

	story := domain.Story{}
	err = ctx.Db.First(&story, model.StoryID).Error
	if err != nil {
		return nil, err
	}

	vote := domain.Vote{}
	err = ctx.Db.FirstOrInit(&vote, "story_id = ? AND user_id = ?", story.ID, user.ID).Error
	if err != nil {
		return nil, err
	}

	resultUpvote := false
	resultDownvote := false
	if vote.ID != 0 && vote.IsUpvote == model.IsUpvote {
		err = ctx.Db.Exec("DELETE FROM votes WHERE id = ?", vote.ID).Error
		if err != nil {
			return nil, err
		}
	} else {
		if model.IsUpvote {
			resultUpvote = true
		} else {
			resultDownvote = true
		}
		resultUpvote = model.IsUpvote
		utils.Map(&model, &vote)
		vote.UserID = user.ID
		if err := ctx.Db.Save(&vote).Error; err != nil {
			return nil, err
		}
	}

	//We are doing updates in DB directly instead of saving the object because other users may vote for the same story while we are doing processing
	if err := ctx.Db.Exec("UPDATE stories SET upvotes = (SELECT COUNT(*) FROM votes WHERE story_id = stories.id AND is_upvote = 1) WHERE id = ?", story.ID).Error; err != nil {
		return nil, err
	}
	if err := ctx.Db.Exec("UPDATE stories SET downvotes = (SELECT COUNT(*) FROM votes WHERE story_id = stories.id AND is_upvote = 0) WHERE id = ?", story.ID).Error; err != nil {
		return nil, err
	}
	if err := ctx.Db.Exec("UPDATE stories SET rating = (upvotes - downvotes) WHERE id = ?", story.ID).Error; err != nil {
		return nil, err
	}
	//refetch the story after the update
	err = ctx.Db.First(&story, model.StoryID).Error
	if err != nil {
		return nil, err
	}
	return common.VoteRes{Upvotes: story.Upvotes, Downvotes: story.Downvotes, UserUpvoted: resultUpvote, UserDownvoted: resultDownvote}, nil
}

func GetCities(ctx *Context) (interface{}, error) {
	model := []common.SelectItem{}
	cities := []domain.City{}
	err := ctx.Db.Find(&cities).Error
	if err != nil {
		return nil, err
	}
	for _, city := range cities {
		model = append(model, common.SelectItem{ID: city.ID, Title: city.Title})
	}
	return model, nil
}

func GetCategories(ctx *Context) (interface{}, error) {
	model := []common.SelectItem{}
	categories := []domain.Category{}
	err := ctx.Db.Find(&categories).Error
	if err != nil {
		return nil, err
	}
	for _, category := range categories {
		model = append(model, common.SelectItem{ID: category.ID, Title: category.Title})
	}
	return model, nil
}
