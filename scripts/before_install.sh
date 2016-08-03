#!/usr/bin/env bash

cd /opt/unicorn
PID = ps -ef | grep "node"
kill $PID