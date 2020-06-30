package facebook

import (
	"fmt"

	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/base"
	"go.uber.org/zap"
)

const url = "https://graph.facebook.com/v2.7/me?fields=email,name,picture"

type picture_data struct {
	Url string
}

type picture struct {
	Data picture_data
}

type user struct {
	Id      string
	Email   string
	Picture picture
	Name    string
	//Link    string `json:link` // this requires `user_link` scope, which requres facebook app approval - will do this later
}

func GetUser(token string, appKey string, appSecretKey string, apiKey string, logger *zap.Logger) (*base.User, error) {
	pUser := user{}
	err := base.FetchProviderUser(
		url,
		map[string]string{
			"Authorization": fmt.Sprintf("OAuth %s", token),
		},
		&pUser,
		logger,
	)
	if err != nil {
		return nil, fmt.Errorf("Failed to fetch facebook user: %s", err)
	}

	u := &base.User{
		Id:       pUser.Id,
		Email:    pUser.Email,
		ImageURL: pUser.Picture.Data.Url,
		Username: pUser.Name,
		//ProfileURL: pUser.Link,
	}

	return u, nil
}
