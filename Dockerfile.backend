FROM golang:1.14.4-alpine

RUN apk add --no-cache gcc libc-dev bash git mysql-client curl openssh-client

ENV ROOT_PATH $GOPATH/src/github.com/s-matyukevich/belarus-civil-rights-support
WORKDIR $ROOT_PATH

EXPOSE 8080