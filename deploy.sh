#!/bin/bash 

set -eu

environment=$1

id=$(cat /dev/urandom | tr -dc 'a-z' | fold -w 8 | head -n 1)
tag=${environment}-${id}
echo "Tag: ${tag}"
docker build . -f Dockerfile.combined -t smatyukevich/dapamazhy.by:${tag}
docker push smatyukevich/dapamazhy.by:${tag}

#gcloud auth login
gcloud container clusters get-credentials dapamazhy-by --zone europe-west3-a --project dapamazhy-by

helm upgrade -f ./k8s/values-${environment}.yaml \
  --set-file config=./config/${environment}-secret.yaml \
  --set-file serviceAccount=./config/dapamazhy-by-storage-creator.json \
  --set image.tag=${tag}  dapamazhy-by-${environment} \
  --namespace ${environment} ./k8s 