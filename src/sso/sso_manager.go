package sso

import (
	"fmt"

	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/base"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/facebook"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/vk"
	"go.uber.org/zap"
)

func GetUser(provider, token string, logger *zap.Logger) (*base.User, error) {
	switch provider {
	case "facebook":
		return facebook.GetUser(token, logger)
	case "vk":
		return vk.GetUser(token, logger)
	}

	return nil, fmt.Errorf("Unsupported provider: '%s'", provider)
}
