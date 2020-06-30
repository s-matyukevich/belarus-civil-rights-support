package base

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/s-matyukevich/belarus-civil-rights-support/src/utils"
	"go.uber.org/zap"
)

type User struct {
	Id         string
	Email      string
	Username   string
	ImageURL   string
	ProfileURL string
}

func FetchProviderUser(url string, headers map[string]string, user interface{}, logger *zap.Logger) error {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}

	for k, v := range headers {
		req.Header.Set(k, v)
	}

	proxy := utils.NewLoggingRequestProxy(logger)
	res, err := proxy.Do(req)
	if err != nil {
		return err
	}
	if res.StatusCode != 200 {
		return fmt.Errorf("Non 200 status code from OAuth provider: %d", res.StatusCode)
	}

	content, err := ioutil.ReadAll(res.Body)
	res.Body.Close()
	if err != nil {
		return err
	}

	err = json.Unmarshal(content, user)
	if err != nil {
		return err
	}

	return nil
}
