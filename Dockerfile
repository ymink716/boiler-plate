FROM node:alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

COPY ./.production.env ./

RUN npm install

COPY . .

RUN npm run build

CMD npm run start:prod

EXPOSE 80