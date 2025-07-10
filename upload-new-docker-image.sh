#!/bin/bash
export version=$1
export image=mmk21/hide-and-squeak-server

if [ -z "$version" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 v0.1.0"
  exit 1
fi

if [[ ! $(git tag -l "$version") ]]; then
  echo "Error: Version $version does not exist as a git tag."
  exit 2
fi

if [[ $(git branch --show-current) != "main" ]]; then
  echo "Error: You are currently not on the main git branch. This is probably a mistake."
  echo "Switch away from your feature branch before continuing."
  echo "If you want to continue anyway, press Enter."
  read -s
fi

if [[ $(git describe --tags) != "$version" ]]; then
  echo "Error: There is a more recent git tag than $version"
  echo "Check that the version number provided is correct."
  exit 3
fi

docker build -t mmk21/slime-hook:$VERSION --platform linux/amd64,linux/arm64 .
if [[ $? -ne 0 ]]; then
  echo "Error: Docker build failed. See output above."
  exit 10
fi
docker tag mmk21/slime-hook:$VERSION mmk21/slime-hook:latest

echo "Uploading Docker images to Docker Hub"
docker push mmk21/slime-hook:$VERSION
docker push mmk21/slime-hook:latest
