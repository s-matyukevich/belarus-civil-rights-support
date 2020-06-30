package sso

import (
	"fmt"

	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/base"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/facebook"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/ok"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/vk"
	"go.uber.org/zap"
)

func GetUser(provider string, token string, appKey string, appSecretKey string, apiKey string, logger *zap.Logger) (*base.User, error) {
	switch provider {
	case "facebook":
		return facebook.GetUser(token, appKey, appSecretKey, apiKey, logger)
	case "vk":
		return vk.GetUser(token, appKey, appSecretKey, apiKey, logger)
	case "ok":
		return ok.GetUser(token, appKey, appSecretKey, apiKey, logger)
	}

	return nil, fmt.Errorf("Unsupported provider: '%s'", provider)
}
