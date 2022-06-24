FROM node:14.17.0-alpine as build

WORKDIR /usr/src/app
COPY package*.json ./
COPY . ./
RUN yarn
RUN yarn build

# Stage - Production
FROM nginx:1.17-alpine
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 3005
CMD ["nginx", "-g", "daemon off;"]
