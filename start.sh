#!/bin/bash
set -e

export NODE_ENV=production
export PORT=3021

cd /home/demo.rojgariindia.com/app/release

npm install --omit=dev

exec ./node_modules/.bin/next start -p 3000
