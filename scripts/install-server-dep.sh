#!/bin/bash
sudo su
cd /home/ec2-user/wp-preview-server/

# Installing Node JS:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

# Installing Yarn:
npm install -g yarn

# Installing Project Depencencies:
yarn

# Start the Application:
# nohup yarn dev &
npm run dev&