package controller

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"reflect"
	"strings"
	"testing"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
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
	AuthUserId uint
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
			os.Remove("/tmp/test.db")
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
			store := cookie.NewStore([]byte("secret"))
			router.Use(sessions.Sessions("mainsession", store))
			router.Use(func(c *gin.Context) {
				if tc.AuthUserId != 0 {
					session := sessions.Default(c)
					session.Set("user_id", tc.AuthUserId)
				}
				c.Next()
			})

			SetRoutes(router)

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
			assert.NoError(t, err)
			assert.Equal(t, tc.Expected, res)
			if tc.After != nil {
				tc.After()
			}

			for table, items := range tc.ExpectedDb {
				var count int
				err := db.Table(table).Count(&count).Error
				assert.NoError(t, err)
				assert.Equal(t, len(items), count, "Number of itens in table %s doesn't match")
				if _, ok := items[0].([]interface{}); ok { //this is the case we use to check auto generated tables, like story_categories
					rows, err := db.Table(table).Rows()
					for i := 0; rows.Next(); i++ {
						expectedRow := items[i].([]interface{})
						dbRow := make([]interface{}, len(expectedRow))
						dbRowPtrs := make([]interface{}, len(expectedRow))
						for i := range dbRow {
							dbRowPtrs[i] = &dbRow[i]
						}
						err = rows.Scan(dbRowPtrs...)
						assert.NoError(t, err)
						assert.Equal(t, expectedRow, dbRow)
					}
				} else {
					dbItems := reflect.New(reflect.SliceOf(reflect.TypeOf(items[0]))).Interface()
					err = db.Table(table).Find(dbItems).Error
					assert.NoError(t, err)
					dbSlice := reflect.ValueOf(dbItems).Elem()
					for i, val := range items {
						dbVal := dbSlice.Index(i)
						// We don't care about those to fields while doing comparison so set them to default values
						dbVal.FieldByName("CreatedAt").Set(reflect.ValueOf(time.Time{}))
						dbVal.FieldByName("UpdatedAt").Set(reflect.ValueOf(time.Time{}))
						assert.Equal(t, val, dbVal.Interface())
					}
				}
			}
		})
	}
}
