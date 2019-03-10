#!/bin/bash
SCRIPT_PATH=$(dirname $(realpath -s $0))
source $SCRIPT_PATH/config.sh

fileName=schoolx_`date +%Y-%m-%d_%H:%M`.bak

mkdir -p ~/postgres/backups/schoolx/
pg_dump schoolx > ~/postgres/backups/schoolx/$fileName
gdrive upload ~/postgres/backups/schoolx/$fileName -p $directoryId > /dev/null
result="not done yet"
while [ -n "$result" ]; do
  result=`gdrive upload ~/postgres/backups/schoolx/$fileName -p $directoryId | grep "rateLimitExceeded"`
  sleep 5
done

