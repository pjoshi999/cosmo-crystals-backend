#!/bin/bash
# Increase Node.js heap memory limit
export NODE_OPTIONS="--max-old-space-size=2048"

# Run database migrations if needed
npx prisma migrate deploy

# Start the application
npm start