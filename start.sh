#!/bin/bash
set -e

export NODE_ENV=production
export PORT=3021

cd /home/demo.rojgariindia.com/app/release

exec ./node_modules/.bin/next start -p 3021
