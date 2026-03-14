#!/usr/bin/env bash
# Use this script to start a docker container for a local development database

# TO RUN ON WINDOWS:
# 1. Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
# 2. Install Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-database.sh`

# On Linux and macOS you can run this script directly - `./start-database.sh`

DB_CONTAINER_NAME="spotter-postgres"
ENV_FILE=".env"

if ! [ -x "$(command -v docker)" ]; then
  echo -e "Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "Database container '$DB_CONTAINER_NAME' already running"
  exit 0
fi

if [ "$(docker ps -q -a -f name=$DB_CONTAINER_NAME)" ]; then
  docker start "$DB_CONTAINER_NAME"
  echo "Existing database container '$DB_CONTAINER_NAME' started"
  exit 0
fi

if [ ! -f "$ENV_FILE" ]; then
  echo ".env file not found. Create it first, for example by copying .env.example."
  exit 1
fi

# import env variables from .env
set -a
source "$ENV_FILE"
set +a

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is missing in .env. Add it before starting the database."
  exit 1
fi

if [[ ! "$DATABASE_URL" =~ ^postgres(ql)?://([^:]+):([^@]+)@([^:/]+):([0-9]+)/([^/?#]+)$ ]]; then
  echo "DATABASE_URL in .env is not in the expected format: postgresql://user:password@host:port/database"
  exit 1
fi

DB_PASSWORD="${BASH_REMATCH[3]}"
DB_PORT="${BASH_REMATCH[5]}"

if [ "$DB_PASSWORD" = "password" ]; then
  echo "You are using the default database password"
  read -p "Should we generate a random password for you? [y/N]: " -r REPLY
  if ! [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Please change the default password in the .env file and try again"
    exit 1
  fi  
  # Generate a random URL-safe password
  DB_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_' | tr -d '\n')

  # OS aware sed command to replace the password in the .env file
  if sed --version >/dev/null 2>&1; then
    sed -i -e "s#:password@#:$DB_PASSWORD@#" .env
  else
    sed -i '' -e "s#:password@#:$DB_PASSWORD@#" .env
  fi
fi

docker run -d \
  --name $DB_CONTAINER_NAME \
  -e POSTGRES_USER="postgres" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB=spotter \
  -p "$DB_PORT":5432 \
  docker.io/postgres && echo "Database container '$DB_CONTAINER_NAME' was successfully created"
