#!/bin/bash
cd /home/ec2-user

# Installing Node JS:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

# Installing Yarn:
npm install -g yarn

# Installing Project Depencencies:
# cd wp-preview-server/
# yarn