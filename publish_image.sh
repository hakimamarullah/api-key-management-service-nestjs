#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e
set -o pipefail

# prompt image version
read -p "Enter image version: " image_version

# build image
docker build -t hakimamarullah/api-key-management-service-nestjs:"${image_version}" .

# push image
docker push hakimamarullah/api-key-management-service-nestjs:"${image_version}"
