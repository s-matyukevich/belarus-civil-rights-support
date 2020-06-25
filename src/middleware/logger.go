package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

func Logger(logger *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := uuid.New().String()
		requestLogger := logger.With(zap.String("requestID", requestID))
		c.Set("logger", requestLogger)

		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery
		if raw != "" {
			path = path + "?" + raw
		}

		c.Next()

		latency := time.Now().Sub(start).String()
		clientIP := c.ClientIP()
		method := c.Request.Method
		statusCode := c.Writer.Status()
		errorMessage := c.Errors.ByType(gin.ErrorTypePrivate).String()
		bodySize := c.Writer.Size()

		requestLogger.Debug("Request info",
			zap.String("latency", latency),
			zap.String("clientIP", clientIP),
			zap.String("method", method),
			zap.Int("statusCode", statusCode),
			zap.String("errorMessage", errorMessage),
			zap.Int("bodySize", bodySize),
		)
	}
}
