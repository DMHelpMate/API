#!/usr/bin/env bash

PID_FILE="/var/run/unicorn.pid"
if [[ -e ${PID_FILE} ]]; then
	kill -9 $(cat ${PID_FILE})
fi
