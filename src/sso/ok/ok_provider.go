package ok

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"

	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/base"
	"go.uber.org/zap"
)

const url = "https://api.ok.ru/fb.do?format=json&method=users.getCurrentUser&application_key=%s&access_token=%s"

type user struct {
	Id      string `json:"uid"`
	Email   string `json:"email"`
	Picture string `json:"pic_1"`
	Name    string `json:"name"`
	Url     string `json:"url_profile"`
}

func GetUser(token string, appKey string, appSecretKey string, apiKey string, logger *zap.Logger) (*base.User, error) {
	fullUrl := fmt.Sprintf(url, apiKey, token)
	sign := calcSignature([]string{"application_key", "format", "method"}, []string{apiKey, "json", "users.getCurrentUser"}, token, appSecretKey)
	pUser := user{}
	err := base.FetchProviderUser(
		fullUrl+"&sig="+sign,
		nil,
		&pUser,
		logger,
	)
	if err != nil {
		return nil, fmt.Errorf("Failed to fetch ok user: %s", err.Error())
	}

	u := &base.User{
		Id:         pUser.Id,
		Email:      pUser.Email,
		ImageURL:   pUser.Picture,
		Username:   pUser.Name,
		ProfileURL: pUser.Url,
	}

	return u, nil
}

func calcSignature(keys []string, values []string, token string, secretKey string) string {
	hash := md5.Sum([]byte(token + secretKey))
	key := hex.EncodeToString(hash[:])

	sign := ""
	for i := range keys {
		sign += keys[i] + "=" + values[i]
	}
	hash = md5.Sum([]byte(sign + key))
	return hex.EncodeToString([]byte(hash[:]))
}
