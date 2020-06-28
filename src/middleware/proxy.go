package middleware

import (
	"net/http"
	"net/http/httputil"

	"github.com/gin-gonic/gin"
)

func ReverseProxy(target string) gin.HandlerFunc {
	return func(c *gin.Context) {
		director := func(req *http.Request) {
			req.URL.Scheme = "http"
			req.URL.Host = target
		}
		modifyResponse := func(r *http.Response) error {
			if r.StatusCode != 200 {
				c.Next()
			}
			return nil
		}
		proxy := &httputil.ReverseProxy{Director: director, ModifyResponse: modifyResponse}
		proxy.ServeHTTP(c.Writer, c.Request)
	}
}
