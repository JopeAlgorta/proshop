#!/bin/sh
echo "Connecting to db ..."
python manage.py wait_for_db

echo "Migrating ..."
python manage.py migrate # Apply database migrations

echo "Running the Django development server ..."
python manage.py runserver 0:80
