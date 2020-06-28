package controller

import (
	"github.com/gin-contrib/sessions"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/api_models"
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
		return api_models.Status{Success: "Пожалуйста зарегистрируйтесь для того чтобы проголосовать"}, nil
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

	if vote.ID != 0 && vote.IsUpvote == model.IsUpvote {
		return api_models.Status{Success: "Вы уже голосовали за эту историю"}, nil
	}

	utils.Map(&model, &vote)
	vote.UserID = user.ID
	if err := ctx.Db.Save(&vote).Error; err != nil {
		return nil, err
	}

	//We are doing updates in DB directly instead of saving the object because other users may vote for the same story while we are doing processing
	if err := ctx.Db.Exec("UPDATE stories SET upvotes = (SELECT COUNT(*) FROM votes WHERE story_id = stories.id AND is_upvote = 1) WHERE id = ?", story.ID).Error; err != nil {
		return nil, err
	}
	if err := ctx.Db.Exec("UPDATE stories SET downvotes = (SELECT COUNT(*) FROM votes WHERE story_id = stories.id AND is_upvote = 0) WHERE id = ?", story.ID).Error; err != nil {
		return nil, err
	}
	if err := ctx.Db.Exec("UPDATE stories SET rating = (upvotes - downvotes)", story.ID).Error; err != nil {
		return nil, err
	}
	//refetch the story after the update
	err = ctx.Db.First(&story, model.StoryID).Error
	if err != nil {
		return nil, err
	}
	return common.VoteRes{Upvotes: story.Upvotes, Downvotes: story.Downvotes}, nil
}
