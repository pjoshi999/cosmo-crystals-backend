#!/bin/bash
# Set memory limits for Node.js
export NODE_OPTIONS="--max-old-space-size=512"

# Generate Prisma client with minimal logging
npx prisma generate --no-engine-logs

# Start with production optimization flags
NODE_ENV=production ts-node --transpile-only src/app.ts