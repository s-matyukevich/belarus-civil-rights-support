package controller

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/domain"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/sso"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
	"go.uber.org/zap"
)

func Logout(ctx *Context) (interface{}, error) {
	session := sessions.Default(ctx.GinCtx)
	session.Delete("user_id")

	ctx.GinCtx.Redirect(http.StatusFound, "/")
	return nil, nil
}

func GetLoginProviders(ctx *Context) (interface{}, error) {
	res := []interface{}{}
	for providerName, providerOptions := range ctx.Config.OAuth {
		pval := map[string]interface{}{
			"name":     providerName,
			"auth_url": providerOptions.AuthUrl,
			"image":    providerOptions.Image,
		}
		pval["client_id"] = providerOptions.ClientId
		pval["redirect_url"] = getOauthRedirectUrl(providerName, ctx)
		if len(providerOptions.Scopes) > 0 {
			pval["scope"] = strings.Join(providerOptions.Scopes, ",")
		}
		res = append(res, pval)
	}
	return res, nil
}

func getOauthRedirectUrl(provider string, ctx *Context) string {
	return fmt.Sprintf("%s/oauth-callback?provider=%s", ctx.Config.Host, provider)
}

func OauthCallback(ctx *Context) (interface{}, error) {
	session := sessions.Default(ctx.GinCtx)

	code := ctx.GinCtx.Query("code")
	oauthErr := ctx.GinCtx.Query("error")
	provider := ctx.GinCtx.Query("provider")
	if provider == "" || code == "" {
		ctx.Logger.Error("Oath callback is called with empty parameters",
			zap.String("error", oauthErr),
			zap.String("code", code),
			zap.String("provider", provider),
		)

		if oauthErr == "" {
			oauthErr = "Error occured during oauth authentication process."
		}
		ctx.GinCtx.Redirect(http.StatusFound, "/#/?error="+oauthErr)
		return nil, nil
	}

	configProvider := ctx.Config.OAuth[provider]

	proxy := utils.NewLoggingRequestProxy(ctx.Logger)
	data := url.Values(map[string][]string{
		"grant_type":    {"authorization_code"},
		"client_id":     {configProvider.ClientId},
		"client_secret": {configProvider.ClientSecret},
		"code":          {code},
		"redirect_uri":  {getOauthRedirectUrl(provider, ctx)},
	})
	req, err := http.NewRequest("POST", configProvider.TokenUrl, strings.NewReader(data.Encode()))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")
	res, err := proxy.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	type oauthResp struct {
		AccessToken string `json:"access_token"`
	}
	var tokenValue oauthResp
	err = json.Unmarshal(body, &tokenValue)
	if err != nil {
		return nil, err
	}
	userInfo, err := sso.GetUser(provider, tokenValue.AccessToken, ctx.Logger)
	if err != nil {
		return nil, err
	}
	if userInfo.Email == "" {
		ctx.GinCtx.Redirect(http.StatusFound, "/#/?error=Can't find the value of email address")
		return nil, nil
	}

	ctx.Logger.Sugar().Debugw("Recived user info from OAuth provider", "provider", provider, "userInfo", userInfo)
	user := &domain.User{}
	result := ctx.Db.Where("o_auth_provider = ? AND o_auth_provider_id = ?", provider, userInfo.Id).First(user)
	if result.Error != nil && !result.RecordNotFound() {
		return nil, fmt.Errorf("Failed to load user: %s", result.Error)
	}

	if result.RecordNotFound() {
		var link []byte
		if userInfo.ProfileURL != "" {
			link, err = json.Marshal([]string{userInfo.ProfileURL})
			if err != nil {
				return nil, err
			}
		}
		user = &domain.User{
			Role:            "user",
			Username:        userInfo.Username,
			Email:           userInfo.Email,
			ImageURL:        userInfo.ImageURL,
			SocialLinks:     string(link),
			OAuthProvider:   provider,
			OAuthProviderId: userInfo.Id,
		}
		err = ctx.Db.Create(user).Error
		if err != nil {
			return nil, fmt.Errorf("Failed to create user: %s", err)
		}
	}

	session.Set("user_id", user.ID)
	ctx.GinCtx.Redirect(http.StatusFound, "/")
	return nil, nil
}