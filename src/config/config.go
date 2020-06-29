package config

import (
	"fmt"
	"net/url"
)

type Database struct {
	Host     string
	Port     int
	Username string
	Password string
	Database string
}

type OAuthProvider struct {
	ClientId     string   `yaml:"client_id"`
	Image        string   `yaml:"image"`
	ClientSecret string   `yaml:"client_secret"`
	AuthUrl      string   `yaml:"auth_url"`
	TokenUrl     string   `yaml:"token_url"`
	Scopes       []string `yaml:"scopes"`
}

func (db *Database) Url() string {
	databaseUrl := fmt.Sprintf("%s:%s@tcp(%s:%d)/", db.Username, db.Password, db.Host, db.Port)
	return databaseUrl
}

func (db *Database) UrlWithDB() string {
	databaseUrl := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?parseTime=true", db.Username, db.Password, db.Host, db.Port, url.QueryEscape(db.Database))
	return databaseUrl
}

type Config struct {
	Database      Database `yaml:"db"`
	Port          int
	SessionSecret string
	OAuth         map[string]OAuthProvider `yaml:"oauth"`
	Host          string
	UIProxyDomain string `yaml:"ui_proxy_domain"`
	AllowCors     bool   `yaml:"allow_cors"`
	PreloadData   bool   `yaml:"preload_data"`
	Data          map[string][]string
}
