FROM node:18-alpine3.17 as build
WORKDIR /app
COPY . /app
RUN yarn install
EXPOSE 5173
CMD ["yarn", "run", "dev"]