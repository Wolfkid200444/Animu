#!/bin/bash

git config --global push.default matching
git remote add deploy ssh://lightyagami@140.82.39.61/srv/Animu
git push deploy master

ssh lightyagami@140.82.39.61 <<EOF
  . /etc/profile
  cp /srv/env/.env /srv/Animu/
  cd /srv/Animu
  yarn
  pm2 restart
EOF