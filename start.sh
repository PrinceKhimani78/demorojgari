#!/bin/bash
set -e

# Export environment variables
export NODE_ENV=production
export PORT=3021

# Next.js will look for the .next folder from the current working directory.
# The `deploy.yml` uploads the release folder into /app,
# so we change directory into the root of the uploaded release.
cd /home/demo.rojgariindia.com/app/release

# Running npm install here is redundant if it's run in the PM2 restart step,
# but kept here for robustness in case it's run manually.
npm install --omit=dev

# Start the Next.js production server
exec /usr/bin/env node ./node_modules/.bin/next start -p $PORT