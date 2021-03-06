#
# CloudBoost Services Dockerfile
#

# Pull base image ununtu image.
FROM node:boron

#Maintainer.
MAINTAINER Nawaz Dhandala <nawazdhandala@outlook.com>


RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Expose ports.
#   - 3000: CloudBoost HTTP REST API
EXPOSE 3000

#Run the app
CMD [ "npm", "start" ]
