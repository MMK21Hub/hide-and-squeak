# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.1.0

FROM node:${NODE_VERSION}-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN corepack enable
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=bind,source=backend/package.json,target=backend/package.json \
    --mount=type=cache,target=/root/.yarn \
    yarn workspaces focus hide-and-squeak-server --production

# Run the application as a non-root user.
USER node

# Copy the source files into the image.
COPY ./backend ./backend
WORKDIR /usr/src/app/backend

# Expose the port that the application listens on.
EXPOSE 3010

# Run the application.
RUN yarn build
CMD ["node", "dist/main.js"]