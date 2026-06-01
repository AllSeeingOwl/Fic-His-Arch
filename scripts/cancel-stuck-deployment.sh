#!/bin/bash
# Script to cancel a stuck GitHub Pages deployment
# Usage: ./scripts/cancel-stuck-deployment.sh <GITHUB_TOKEN> <REPOSITORY> <DEPLOYMENT_HASH>
# Example: ./scripts/cancel-stuck-deployment.sh ghp_xyz123 AllSeeingOwl/Fic-His-Arch ae885d58859726a223e031b7507af1b13d0fdef7

if [ "$#" -ne 3 ]; then
  echo "Usage: $1 <GITHUB_TOKEN> <REPOSITORY> <DEPLOYMENT_HASH>"
  echo "Exiting."
  # avoid using exit to not block session
else
  TOKEN=$1
  REPO=$2
  HASH=$3

  echo "Attempting to cancel deployment $HASH in repository $REPO..."

  curl -L -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    https://api.github.com/repos/$REPO/pages/deployments/$HASH/cancel

  echo ""
  echo "Done."
fi
