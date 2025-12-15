#!/bin/bash
export NODE_ENV=production
export PORT=3021
exec /usr/bin/node node_modules/next/dist/bin/next start -p 3021
