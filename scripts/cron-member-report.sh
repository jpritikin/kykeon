#!/usr/bin/env bash
set -euo pipefail
source ~/.config/kykeon/d1-credentials
cd "$(dirname "$0")/.."

LOG_DIR="$HOME/.cache/kykeon"
LOG_FILE="$LOG_DIR/member-report.log"
MAX_LOG_LINES=2000
mkdir -p "$LOG_DIR"

set +e
output="$(npx tsx scripts/member-report.ts "$@" 2>&1)"
status=$?
set -e

if [[ -n "$output" ]]; then
    echo "$output"
    {
        echo "=== $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
        echo "$output"
    } >> "$LOG_FILE"
    tail -n "$MAX_LOG_LINES" "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi

exit $status
