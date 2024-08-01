FROM node:alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

COPY ./.production.env ./

RUN npm install

COPY . .

RUN npm run build

# CMD npm run start:prod

ENTRYPOINT ["/bin/bash", "-c", "sleep 500"]

EXPOSE 80