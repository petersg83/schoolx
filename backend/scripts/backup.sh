#!/bin/bash
source ${0%/*}/config.sh

fileName=schoolx_`date +%Y-%m-%d_%H:%M`.bak

mkdir -p ~/postgres/backups/schoolx/
pg_dump schoolx > ~/postgres/backups/schoolx/$fileName
gdrive upload ~/postgres/backups/schoolx/$fileName -p $directoryId > /dev/null
