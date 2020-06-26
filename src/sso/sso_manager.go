package sso

import (
	"fmt"

	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/base"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso/facebook"
	"go.uber.org/zap"
)

func GetUser(provider, token string, logger *zap.Logger) (*base.User, error) {
	switch provider {
	case "facebook":
		return facebook.GetUser(token, logger)
	}
	return nil, fmt.Errorf("Unsupported provider: '%s'", provider)
}
