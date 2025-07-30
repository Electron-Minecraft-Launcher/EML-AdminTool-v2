FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

EXPOSE 8080

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]