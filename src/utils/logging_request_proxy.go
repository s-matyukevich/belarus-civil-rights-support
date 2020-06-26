package utils

import (
	"net/http"
	"net/http/httputil"

	"go.uber.org/zap"
)

func NewLoggingRequestProxy(logger *zap.Logger) *RequestProxy {
	return &RequestProxy{logger: logger}
}

type RequestProxy struct {
	logger *zap.Logger
}

func (p *RequestProxy) Do(req *http.Request) (resp *http.Response, err error) {
	dump, err := httputil.DumpRequestOut(req, true)
	if err != nil {
		return nil, err
	}
	p.logger.Debug("Request dump", zap.String("request-data", string(dump)))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	dump, err = httputil.DumpResponse(res, true)
	if err != nil {
		return nil, err
	}
	p.logger.Debug("Response dump", zap.String("response-data", string(dump)))
	return res, nil
}
