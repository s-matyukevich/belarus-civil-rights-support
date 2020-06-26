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
		fields := []zap.Field{zap.String("path", path)}

		c.Next()

		fields = append(fields, zap.String("latency", time.Now().Sub(start).String()))
		fields = append(fields, zap.String("clientIP", c.ClientIP()))
		fields = append(fields, zap.String("method", c.Request.Method))
		fields = append(fields, zap.Int("statusCode", c.Writer.Status()))
		fields = append(fields, zap.String("internalError", c.Errors.ByType(gin.ErrorTypePrivate).String()))
		fields = append(fields, zap.Int("responseSize", c.Writer.Size()))
		if c.Writer.Status() != 200 && c.Request.Body != nil {
			data, err := c.GetRawData()
			if err != nil {
				fields = append(fields, zap.String("getRawDataError", err.Error()))
			} else {
				fields = append(fields, zap.String("body", string(data)))
			}
		}

		requestLogger.Debug("Request info", fields...)
	}
}
