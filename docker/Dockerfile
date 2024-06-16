FROM node:20

WORKDIR /usr/src/app

ENV CHOKIDAR_USEPOLLING=true

COPY package*.json ./

RUN mkdir api client shared
COPY api/package*.json ./api
COPY client/package*.json ./client
COPY shared/package*.json ./shared

RUN npm i
RUN npm i --workspace=api
RUN npm i --workspace=client
RUN npm i --workspace=shared

COPY api ./api
COPY client ./client
COPY shared ./shared

EXPOSE 3000 5173

CMD ["npm", "run", "dev"]
