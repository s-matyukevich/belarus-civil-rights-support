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

func (db *Database) Url() string {
	databaseUrl := fmt.Sprintf("%s:%s@tcp(%s:%d)/", db.Username, db.Password, db.Host, db.Port)
	return databaseUrl
}

func (db *Database) UrlWithDB() string {
	databaseUrl := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", db.Username, db.Password, db.Host, db.Port, url.QueryEscape(db.Database))
	return databaseUrl
}

type Config struct {
	Database Database `yaml:"db"`
	Port     int
}
