#!/bin/bash
sudo su
cd /home/ec2-user/cms-wordpress/

# Installing Node JS:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

## If using npm ##
npm i

## If using Yarn ##
# npm install -g yarn
# Installing Project Depencencies:
# yarn

# Installing pm2-npm
npm install pm2 -g

# If is an update, kill current process
pm2 stop all

# Start the Application:
pm2 --name PreviewServer start npm -- run dev
