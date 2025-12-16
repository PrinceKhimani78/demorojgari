#!/bin/bash
set -e

# Export environment variables
export NODE_ENV=production
export PORT=3021 # <-- UPDATED PORT

# Next.js will look for the .next folder from the current working directory.
cd /home/demo.rojgariindia.com/app/release

# Ensure all production dependencies are available.
npm install --omit=dev

# Start the Next.js production server
# The -p $PORT ensures it uses 3021
exec /usr/bin/env node ./node_modules/.bin/next start -p $PORT