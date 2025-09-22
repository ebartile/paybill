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

# Check if PG_USER, PG_HOST, PG_PASS, PG_DB are present or empty
if [[ -z "$PG_USER" ]] || [[ -z "$PG_HOST" ]] || [[ -z "$PG_PASS" ]] || [[ -z "$PG_DB" ]]; then
  # Prompt user for values
  read -p "Enter PostgreSQL database username: " PG_USER
  read -p "Enter PostgreSQL database hostname: " PG_HOST
  read -p "Enter PostgreSQL database password: " PG_PASS
  read -p "Enter PostgreSQL database name: " PG_DB

  # Update .env file
  awk -v pg_user="$PG_USER" -v pg_host="$PG_HOST" -v pg_pass="$PG_PASS" -v pg_db="$PG_DB" '
    BEGIN { FS=OFS="=" }
    /^PG_USER=/ { $2=pg_user; found=1 }
    /^PG_HOST=/ { $2=pg_host; found=1 }
    /^PG_PASS=/ { $2=pg_pass; found=1 }
    /^PG_DB=/ { $2=pg_db; found=1 }
    1
    END {
      if (!found) {
        print "PG_USER="pg_user
        print "PG_HOST="pg_host
        print "PG_PASS="pg_pass
        print "PG_DB="pg_db
      }
    }
  ' .env > temp.env && mv temp.env .env

  echo "Successfully updated postgresql database values .env file"
fi

# Copy values from PG to PB_DB
PB_DB_USER=$PG_USER
PB_DB_HOST=$PG_HOST
PB_DB_PASS=$PG_PASS

# Update .env file for PB_DB
awk -v pb_user="$PB_DB_USER" -v pb_host="$PB_DB_HOST" -v pb_pass="$PB_DB_PASS" '
  BEGIN { FS=OFS="=" }
  /^PB_DB_USER=/ { $2=pb_user; found=1 }
  /^PB_DB_HOST=/ { $2=pb_host; found=1 }
  /^PB_DB_PASS=/ { $2=pb_pass; found=1 }
  1
  END { if (!found) print "PB_DB_USER="pb_user ORS "PB_DB_HOST="pb_host ORS "PB_DB_PASS="pb_pass }
' .env > temp.env && mv temp.env .env

echo "Successfully updated paybill database values in the .env file"

exec "$@"