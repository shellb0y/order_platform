#!/bin/bash

cd /usr/local/src/order_platform
git pull origin master
npm install
#echo "complete">>/usr/local/src/pm2_webhook_test/deploy.log

