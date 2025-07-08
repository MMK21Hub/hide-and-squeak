# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.1.0

FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY . .
RUN corepack enable
RUN yarn cache clean
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

# Copy built files
COPY --from=builder --chown=node:node /app/backend/dist ./backend/dist
COPY --from=builder --chown=node:node /app/frontend/dist ./frontend/dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/backend/generated ./backend/generated

# Run the application as a non-root user
USER node

# Run the application
EXPOSE 3010
ENV NODE_ENV=production
CMD ["node", "backend/dist/main.js"]