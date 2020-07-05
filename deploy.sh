#!/bin/bash 

set -euo pipefail

environment=$1

docker build . -f Dockerfile.combined -t smatyukevich/dapamazhy.by:${environment}
docker push smatyukevich/dapamazhy.by:${environment}

#gcloud auth login
gcloud container clusters get-credentials dapamazhy-by --zone europe-west3-a --project dapamazhy-by

helm upgrade -f ./k8s/values-prod.yaml --set-file config=./config/prod-secret.yaml  dapamazhy-by ./k8s 