#!/usr/bin/env bash
# deploy.sh — Build, deploy to Hetzner, and push to GitHub
# Usage: ./deploy.sh "commit message"

set -e

MSG="${1:-deploy: update}"

echo "==> Building..."
npm run build

echo "==> Deploying to Hetzner..."
scp -r dist/* root@178.156.198.6:/var/www/freereign/

echo "==> Git commit & push..."
git add -A
git commit -m "$MSG"
git push origin main

echo "==> Done! Live at https://freereign.dev"
