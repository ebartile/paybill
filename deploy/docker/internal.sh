#!/bin/bash

# Load the .env file
source .env

# Check if APP_KEY is present or empty
if [[ -z "$APP_KEY" ]]; then
  # Generate APP_KEY
  APP_KEY=$(openssl rand -hex 64)

  # Update .env file
  awk -v key="$APP_KEY" '
    BEGIN { FS=OFS="=" }
    /^APP_KEY=/ { $2=key; found=1 }
    1
    END { if (!found) print "APP_KEY="key }
  ' .env > temp.env && mv temp.env .env

  echo "Created a secret key for secure operations."
else
  echo "The secret key base is already in place."
fi

# Function to generate a random password
generate_password() {
  openssl rand -base64 12 | tr -d '/+' | cut -c1-16
}

# Check if PG_PASS and PB_DB_PASS are present or empty
if [[ -z "$PG_PASS" ]] && [[ -z "$PB_DB_PASS" ]]; then
  # Generate random passwords
  PASSWORD=$(generate_password)

  # Update .env file
  awk -v pass="$PASSWORD" '
    BEGIN { FS=OFS="=" }
    /^(PG_PASS|PB_DB_PASS)=/ { $2=pass; found=1 }
    1
    END { if (!found) print "PG_PASS="pass ORS "PB_DB_PASS="pass }
  ' .env > temp.env && mv temp.env .env

  echo "Successfully generated a secure password for the PostgreSQL database."
else
  echo "Postgres password already exist"
fi

exec "$@"