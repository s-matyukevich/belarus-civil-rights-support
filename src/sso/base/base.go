package base

import (
	"encoding/json"
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

	content, err := ioutil.ReadAll(res.Body)
	res.Body.Close()
	if err != nil {
		return err
	}

	json.Unmarshal(content, user)

	return nil
}
