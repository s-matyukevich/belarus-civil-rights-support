package config

import (
	"fmt"
	"net/url"
)

type Database struct {
	Host         string
	Port         int
	Username     string
	Password     string
	DatabaseName string
}

func (db *Database) Url() string {
	databaseUrl := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", db.Username, db.Password, db.Host, db.Port, url.QueryEscape(db.DatabaseName))
	return databaseUrl
}

type Config struct {
	Database Database `yaml:"db"`
	Port     int      `env:"PORT"`
}
