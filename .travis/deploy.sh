#!/bin/bash
set -e
git config --global push.default simple
git remote add production ssh://lightyagami@140.82.39.61/srv/Animu
git push production master