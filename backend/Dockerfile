# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.1.0

FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app/backend

RUN corepack enable
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=.yarnrc.yml,target=.yarnrc.yml \
    --mount=type=cache,target=/root/.yarn \
    yarn install

# Run the application as a non-root user.
RUN chown -R node:node /usr/src/app
USER node

# Copy the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3010

# Compile the TypeScript code
RUN yarn build
# Run the application.
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]