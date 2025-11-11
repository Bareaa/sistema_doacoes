#!/bin/bash
echo "🧰 Corrigindo permissões em /var/app/staging"
sudo chown -R webapp:webapp /var/app/staging
sudo chmod -R 755 /var/app/staging
