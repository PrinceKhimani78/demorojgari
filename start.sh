#!/bin/bash

cd /home/demo.rojgariindia.com/app

echo ">>> Starting Demo Next.js on port 3020"
exec /usr/bin/npm start -- -p 3020 -H 0.0.0.0
