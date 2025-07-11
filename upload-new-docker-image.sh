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

if [[ $(git describe --tag --abbrev=0) != "$version" ]]; then
  echo "Error: There is a more recent git tag than $version"
  echo "Check that the version number provided is correct."
  exit 3
fi

# Preparations for multi-arch builds
# See https://www.docker.com/blog/faster-multi-platform-builds-dockerfile-cross-compilation-guide/
echo "Setting up multi-arch builds with Docker BuildKit"
export builder_name=hide-and-squeak-builder
docker buildx create --use --name $builder_name

# Install emulators
builder_platforms=$(docker buildx --builder hide-and-squeak-builder inspect | grep Platforms:)
if [[ "$builder_platforms" == *"linux/amd64"* && "$builder_platforms" == *"linux/arm64"* ]]; then
  echo "Skipping emulator installation because they are already available."
else
  echo "Installing emulators using the Binfmt tool"
  # We don't need to install the emulator for the native architecture
  arch=$(uname --machine)
  if [[ "$arch" == "x86_64" ]]; then
    docker run --privileged --rm tonistiigi/binfmt --install arm64
  elif [[ "$arch" == "aarch64" ]]; then
    docker run --privileged --rm tonistiigi/binfmt --install amd64
  else
    docker run --privileged --rm tonistiigi/binfmt --install arm64,amd64
  fi
fi

docker buildx build -t $image:$version --platform linux/amd64,linux/arm64 --load .
if [[ $? -ne 0 ]]; then
  echo "Error: Docker build failed. See output above."
  exit 10
fi
docker tag $image:$version $image:latest

echo "Uploading Docker images to Docker Hub"
docker push $image:$version
docker push $image:latest
