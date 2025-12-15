#!/bin/bash

export NODE_ENV=production
export PORT=3021

cd /home/demo.rojgariindia.com/app/release

echo ">>> Starting Demo Next.js on port 3021"

exec ./node_modules/.bin/next start -p 3021 -H 0.0.0.0
