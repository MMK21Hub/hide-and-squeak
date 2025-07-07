# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.1.0

FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
COPY . .
RUN corepack enable
# Leverage a cache mount to /root/.yarn to speed up subsequent builds
RUN --mount=type=cache,target=/root/.yarn \
    yarn install

RUN yarn workspace hide-and-squeak build
RUN yarn workspace hide-and-squeak-server build

FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app

# Copy built files
COPY --from=builder /app/backend/dist ./backend
COPY --from=builder /app/frontend/dist ./frontend
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/generated ./backend/generated

# Run the application as a non-root user
RUN chown -R node:node /usr/src/app
USER node

# Run the application
EXPOSE 3010
ENV NODE_ENV=production
CMD ["node", "backend/main.js"]