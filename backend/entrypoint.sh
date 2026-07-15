#!/usr/bin/env bash
set -e

# Run database migrations and collectstatic, then exec the provided CMD
echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting process: $@"
exec "$@"
