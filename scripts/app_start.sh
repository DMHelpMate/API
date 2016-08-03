#!/usr/bin/env bash

cd /opt/unicorn
nohup node app.js > /var/log/unicorn.log 2>&1&
echo $! > /var/run/unicorn.pid