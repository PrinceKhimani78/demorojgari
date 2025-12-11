#!/bin/bash
cd /home/demo.rojgariindia.com/app/release

echo ">>> Starting Demo Next.js on port 3020"

# Use node_modules next binary
./node_modules/.bin/next start -p 3020 -H 0.0.0.0
