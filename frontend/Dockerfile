FROM node:18-alpine3.17 as build
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . /app
EXPOSE 5173
CMD ["yarn", "run", "dev"]