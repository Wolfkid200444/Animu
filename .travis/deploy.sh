#!/bin/bash

git config --global push.default matching
git remote add deploy ssh://lightyagami@140.82.39.61/srv/Animu
git push deploy master

ssh lightyagami@140.82.39.61 <<EOF
  . /home/lightyagami/.profile
  PATH="/home/lightyagami/.nvm/versions/node/v12.12.0/bin:$PATH"
  cp /srv/env/.env /srv/Animu/
  cd /srv/Animu
  ls -a
  yarn
  pm2 delete 0
  pm2 start
EOF