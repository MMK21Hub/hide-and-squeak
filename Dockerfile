# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.1.0

# Always run the builder using the host architecture (for better performance)
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY . .
RUN corepack enable
# Leverage a cache mount to /root/.yarn etc to speed up subsequent builds
# RUN --mount=type=cache,target=/root/.yarn \
#     --mount=type=cache,target=.yarn \
#     --mount=type=cache,target=node_modules \
RUN \
    yarn install --inline-builds
# Generate Prisma client
RUN yarn run db:generate

RUN yarn workspace hide-and-squeak build
RUN yarn workspace hide-and-squeak-server build

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /usr/src/app

# Add Tini
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

# Copy built files
COPY --from=builder --chown=node:node /app/backend/dist ./backend/dist
COPY --from=builder --chown=node:node /app/frontend/dist ./frontend/dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/backend/generated ./backend/generated
COPY backend/prisma backend/prisma
COPY deployment/entrypoint.sh entrypoint.sh

# Run the application as a non-root user
USER node

# Suppress "New version of npm available!" notices
ENV NO_UPDATE_NOTIFIER=true
# Run the application
EXPOSE 3010
ENV NODE_ENV=production
CMD ["sh", "entrypoint.sh"]
