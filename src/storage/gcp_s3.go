package storage

import (
	"context"
	"io"
	"net/http"

	"cloud.google.com/go/storage"
	"github.com/s-matyukevich/belarus-civil-rights-support/src/config"
	"google.golang.org/api/option"
)

func SaveObjectToS3(url string, name string, config *config.Config) (string, error) {
	client, err := storage.NewClient(context.Background(), option.WithCredentialsFile(config.GCPServiceAccountPath))
	if err != nil {
		return "", err
	}
	defer client.Close()

	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	wc := client.Bucket(config.GCPBucketName).Object("images/" + name).NewWriter(context.Background())
	if _, err = io.Copy(wc, resp.Body); err != nil {
		return "", err
	}
	if err := wc.Close(); err != nil {
		return "", err
	}

	return "https://storage.googleapis.com/" + config.GCPBucketName + "/images/" + name, nil
}
