#!/bin/bash
set -e

export NODE_ENV=production
export PORT=3021

cd /home/demo.rojgariindia.com/app/release

# ensure prod deps exist
npm install --omit=dev

# start Next.js exactly as intended
exec ./node_modules/.bin/next start -p 3021
