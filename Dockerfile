FROM node:alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

COPY ./.production.env ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 80

CMD npm run start:prod

# ENTRYPOINT ["/bin/bash", "-c", "sleep 5000"]
# ENTRYPOINT ["/bin/sh", "-c", "sleep 5000"]

