#!/bin/bash
set -e

pnpm clean

# Load environment variables from .env if the file exists
if [ -f "./.env" ]; then
  export $(grep -v '^#' ./.env | xargs -d '\n') || true
fi

# Check WORKLOW_WORKER and skip SETUP_CMD if true
if [ "${WORKFLOW_WORKER}" == "true" ]; then
  echo "WORKFLOW_WORKER is set to true. Running worker process."
  pnpm worker:prod
else
  SETUP_CMD='pnpm db:create'
fi

# Wait for PostgreSQL connection
if [ -z "$DATABASE_URL" ]; then
  ./scripts/wait-for-it.sh $PG_HOST:${PG_PORT:-5432} --strict --timeout=300 -- echo "PostgreSQL is up"
else
  PG_HOST=$(echo "$DATABASE_URL" | awk -F'[/:@?]' '{print $6}')
  PG_PORT=$(echo "$DATABASE_URL" | awk -F'[/:@?]' '{print $7}')

  ./scripts/wait-for-it.sh "$PG_HOST:$PG_PORT" --strict --timeout=300 -- echo "PostgreSQL is up"
fi

# Note: This Redis connection check changes are only for EE repo

# Check Redis connection
if [ -z "$REDIS_URL" ]; then
  if [ -z "$REDIS_HOST" ] || [ -z "$REDIS_PORT" ]; then
    echo "Waiting for Redis connection..."
  fi

  ./scripts/wait-for-it.sh $REDIS_HOST:${REDIS_PORT:-6379} --strict --timeout=300 -- echo "Redis is up"
else
  echo "REDIS_URL connection is set"
fi

# Run setup command if defined
if [ -n "$SETUP_CMD" ]; then
  $SETUP_CMD
fi

exec "$@"