#!/usr/bin/env bash

cd /opt/unicorn
nohup node app.js > my.log 2>&1&
echo $! > save_pid.txt