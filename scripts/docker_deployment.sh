#!/bin/bash

# Default values
IMAGE_NAME="flowinquiry-frontend"
REMOTE_REPO="flowinquiry/${IMAGE_NAME}"
TAG="latest"

# Parse arguments for custom tag
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --tag) TAG="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Step 1: Build the Docker image
echo "Building Docker image..."
docker build -t ${IMAGE_NAME} -f Dockerfile .

# Step 2: Tag the Docker image with both the specified tag and 'latest'
echo "Tagging Docker image with '${TAG}' and 'latest'..."
docker tag ${IMAGE_NAME} ${REMOTE_REPO}:${TAG}
docker tag ${IMAGE_NAME} ${REMOTE_REPO}:latest

# Step 3: Log in to the Docker repository (Docker Hub by default)
echo "Logging into Docker repository..."
docker login || { echo "Login failed"; exit 1; }

# Step 4: Push both tags to the remote repository
echo "Pushing Docker image to remote repository with tag '${TAG}'..."
docker push ${REMOTE_REPO}:${TAG}

echo "Pushing Docker image to remote repository with tag 'latest'..."
docker push ${REMOTE_REPO}:latest

echo "Docker image has been pushed successfully with tags '${TAG}' and 'latest'."
