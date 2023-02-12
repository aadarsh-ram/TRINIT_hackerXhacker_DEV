FROM node:18-alpine3.17 as build
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build

FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]