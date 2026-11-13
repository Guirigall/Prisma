#!/usr/bin/env bash
set -e
exec xdg-open "$(cd -- "$(dirname -- "$0")" && pwd)/Prisma.html"
