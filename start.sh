#!/bin/bash
set -e

export NODE_ENV=production
export PORT=3021
export HOSTNAME=0.0.0.0

cd /home/demo.rojgariindia.com/app/release

node server.js
