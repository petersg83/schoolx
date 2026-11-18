#!/bin/bash
# Sauvegarde quotidienne de la base schoolx : dump compressé, envoi sur Google
# Drive, puis rétention (sur le VPS et sur le Drive).
#
# Rétention : on garde tous les backups des KEEP_DAYS derniers jours, et
# au-delà uniquement le premier backup de chaque mois (sans limite de durée).
#
# Usage :
#   backup.sh             dump + envoi + rétention
#   backup.sh --dry-run   ne crée, n'envoie et ne supprime rien : affiche
#                         seulement ce que la rétention supprimerait
#
# Silencieux en cas de succès ; toute erreur sort sur stderr (donc dans le mail
# cron) et interrompt le script avant la moindre suppression.
set -euo pipefail

SCRIPT_PATH=$(dirname "$(realpath -s "$0")")
source "$SCRIPT_PATH/config.sh"

KEEP_DAYS=30
BACKUP_DIR=~/postgres/backups/schoolx

DRY_RUN=false
if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=true
elif [ $# -gt 0 ]; then
  echo "Usage: $0 [--dry-run]" >&2
  exit 2
fi

# Lit des lignes "<ref>|<nom de fichier>" et écrit celles à supprimer.
# Les noms qui ne ressemblent pas à un backup schoolx sont ignorés (jamais supprimés).
select_expired() {
  awk -F'|' -v cutoff="$(date -d "$KEEP_DAYS days ago" +%F)" '
    $2 ~ /^schoolx_[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]_[0-9][0-9][:-][0-9][0-9]\.(bak|sql\.gz)$/ {
      stamp = substr($2, 9, 16)          # AAAA-MM-JJ_HH:MM
      month = substr(stamp, 1, 7)
      lines[++n] = $0
      stamps[n] = stamp
      if (!(month in first) || stamp < first[month]) first[month] = stamp
    }
    END {
      for (i = 1; i <= n; i++) {
        stamp = stamps[i]
        if (substr(stamp, 1, 10) < cutoff && stamp != first[substr(stamp, 1, 7)]) print lines[i]
      }
    }'
}

list_local() {
  find "$BACKUP_DIR" -maxdepth 1 -type f -printf '%p|%f\n'
}

list_drive() {
  gdrive files list --query "'$directoryId' in parents and trashed = false" \
    --max 100000 --skip-header --full-name --field-separator '|' | cut -d'|' -f1,2
}

mkdir -p "$BACKUP_DIR"

if ! $DRY_RUN; then
  fileName=schoolx_$(date +%Y-%m-%d_%H:%M).sql.gz
  filePath=$BACKUP_DIR/$fileName

  # Dump dans un fichier temporaire : en cas d'échec, aucun backup tronqué ne reste.
  tmpPath=$(mktemp "$BACKUP_DIR/.dump.XXXXXX")
  trap 'rm -f "$tmpPath"' EXIT
  pg_dump schoolx | gzip -9 > "$tmpPath"
  gzip -t "$tmpPath"
  chmod 664 "$tmpPath"
  mv "$tmpPath" "$filePath"

  gdrive files upload "$filePath" --parent "$directoryId" > /dev/null
fi

driveFiles=$(list_drive)

# On ne supprime rien tant que le backup du jour n'est pas visible sur le Drive.
if ! $DRY_RUN && ! grep -qF "|$fileName" <<< "$driveFiles"; then
  echo "Backup $fileName introuvable sur le Drive après envoi : rétention annulée." >&2
  exit 1
fi

list_local | select_expired | while IFS='|' read -r path name; do
  if $DRY_RUN; then echo "VPS   : $name"; else rm -- "$path"; fi
done

select_expired <<< "$driveFiles" | while IFS='|' read -r id name; do
  if $DRY_RUN; then echo "Drive : $name"; else gdrive files delete "$id" > /dev/null; fi
done
