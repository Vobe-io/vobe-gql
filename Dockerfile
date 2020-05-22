FROM node:13 AS node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g nodemon
RUN npm install
RUN npm audit fix
COPY . .

EXPOSE 4000
CMD [ "nodemon", "--legacy-watch", "-e", "js,pug,json,graphql" ]
