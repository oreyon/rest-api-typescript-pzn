#!/bin/sh

# Wait for the MySQL service to be available
echo "Waiting for MySQL to be available..."
while ! nc -z mysqldb 3306; do
  sleep 1
done
echo "MySQL is up - executing command"

# Run Prisma migrations
npx prisma migrate deploy

# Execute the CMD from the Dockerfile (or any other command)
exec "$@"
