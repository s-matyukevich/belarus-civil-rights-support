package vk

import (
	"fmt"
	"strconv"

	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/base"
	"go.uber.org/zap"
)

const url = "https://api.vk.com/method/users.get?fields=first_name,last_name,photo_100&access_token=%s&v=5.21"

type user struct {
	Id        int    `json:"id"`
	Picture   string `json:"photo_100"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type response struct {
	Users []user `json:"response"`
}

func GetUser(token string, logger *zap.Logger) (*base.User, error) {
	resp := response{}
	err := base.FetchProviderUser(
		fmt.Sprintf(url, token),
		nil,
		&resp,
		logger,
	)
	if err != nil {
		return nil, fmt.Errorf("Failed to fetch vk user: %s", err.Error())
	}

	if len(resp.Users) != 1 {
		return nil, fmt.Errorf("VK provider returned an empty list of users")
	}

	u := &base.User{
		Id: strconv.Itoa(resp.Users[0].Id),
		//Email:    pUser.Email,
		ImageURL: resp.Users[0].Picture,
		Username: resp.Users[0].FirstName + " " + resp.Users[0].LastName,
		//ProfileURL: "https://vk.com/" + pUser.Id,
	}

	return u, nil
}
