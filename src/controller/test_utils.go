package controller

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/go-querystring/query"
	"github.com/jinzhu/gorm"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/config"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/middleware"
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap/zaptest"
)

type Testcase struct {
	Title      string
	Db         map[string][]interface{}
	Query      interface{}
	Body       interface{}
	Expected   interface{}
	ExpectedDb map[string][]interface{}
	Before     func()
	After      func()
}

func RunCases(t *testing.T, cases []Testcase, reqType string, baseUrl string, mapResutl func([]byte) (interface{}, error)) {
	for _, tc := range cases {
		t.Run(tc.Title, func(t *testing.T) {
			if tc.Before != nil {
				tc.Before()
			}
			db, err := gorm.Open("sqlite3", "/tmp/test.db")
			db = db.Debug()
			assert.NoError(t, err)
			defer db.Close()
			logger := zaptest.NewLogger(t)
			middleware.RunMigrations(db, logger)
			router := gin.New()
			router.Use(gin.Recovery())
			router.Use(middleware.Logger(logger))
			router.Use(middleware.Validator())
			router.Use(middleware.Config(&config.Config{}))
			router.Use(func(c *gin.Context) {
				c.Set("db", db)
				c.Next()
			})
			SetRoutes(router)

			db.Exec("DELETE from users")
			db.Exec("DELETE from stories")
			db.Exec("DELETE from cities")
			db.Exec("DELETE from categories")
			db.Exec("DELETE from story_cities")
			db.Exec("DELETE from story_categories")
			for _, items := range tc.Db {
				for _, item := range items {
					err := db.Create(item).Error
					assert.NoError(t, err)
				}
			}

			url := baseUrl
			if tc.Query != nil {
				v, err := query.Values(tc.Query)
				assert.NoError(t, err)
				url += "?" + v.Encode()
			}
			w := httptest.NewRecorder()
			var body io.Reader
			if tc.Body != nil {
				res, err := json.Marshal(tc.Body)
				assert.NoError(t, err)
				body = strings.NewReader(string(res))
			}
			req, err := http.NewRequest(reqType, url, body)
			if tc.Body != nil {
				req.Header.Add("Content-Type", "application/json")
			}
			assert.NoError(t, err)
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusOK, w.Code)
			res, err := mapResutl(w.Body.Bytes())
			assert.Equal(t, tc.Expected, res)
			if tc.After != nil {
				tc.After()
			}
		})
	}
}
