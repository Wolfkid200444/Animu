#!/bin/bash

git config --global push.default matching
git remote add deploy ssh://lightyagami@140.82.39.61/srv/Animu
git push deploy master

ssh lightyagami@140.82.39.61 <<EOF
  cd /srv/Animu
  pm2 start
EOF