#!/bin/bash
set -e

export NODE_ENV=production
export PORT=3021
export HOSTNAME=0.0.0.0

echo "--- Startup Diagnostics [$(date)] ---"
echo "Port to be used: $PORT"
echo "Hostname: $HOSTNAME"
echo "Network Check (localhost):"
grep "localhost" /etc/hosts || echo "No localhost entry in /etc/hosts"
echo "Disk Usage:"
df -h / | tail -n 1
echo "Port Check (is $PORT in use?):"
netstat -tulpn | grep ":$PORT " || echo "Port $PORT is free"
echo "--------------------------------------"

cd /home/demo.rojgariindia.com/app/release

exec node server.js
