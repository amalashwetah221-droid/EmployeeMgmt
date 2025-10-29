
FROM node:20.19.1 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps


COPY . .
RUN npm run build --prod

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to serve the app
EXPOSE 80

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
