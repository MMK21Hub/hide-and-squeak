#!/bin/sh
# Intended to be run from within the Docker container
set -e

# Run Prism migrations.
# If the command fails, presumable because the DB isn't ready yet, we keep retrying until it works
until npx prisma migrate deploy --schema backend/prisma/schema.prisma; do
  echo "Couldn't run prisma migrate! Trying again in 2 seconds..."
  sleep 2
done
echo "Successfully applied Prisma migrations :D"

exec node backend/dist/main.js