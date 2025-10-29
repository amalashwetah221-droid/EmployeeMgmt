
FROM node:14 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the frontend service
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
