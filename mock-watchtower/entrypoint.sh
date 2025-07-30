#!/bin/sh

ENV_FILE="/config/.env"

if [ -f "$ENV_FILE" ]; then
  echo "🔧 Sourcing $ENV_FILE"
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "🔧 No .env file found at $ENV_FILE"
fi

# Démarre Watchtower avec les paramètres par défaut
exec npm start