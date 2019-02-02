#!/bin/bash
source ./config.sh

fileName=schoolx_`date +%Y-%m-%d_%k:%M`.bak

mkdir -p ~/postgres/backups/schoolx/
pg_dump schoolx > ~/postgres/backups/schoolx/$fileName
gdrive upload ~/postgres/backups/schoolx/$fileName -p $directoryId > /dev/null
