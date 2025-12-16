# Path: /path/to/your/repo/start.sh

#!/bin/bash
set -e
export NODE_ENV=production
export PORT=3021
cd /home/demo.rojgariindia.com/app/release
# REMOVED: npm install --omit=dev 
exec /usr/bin/env node ./node_modules/.bin/next start -p $PORT