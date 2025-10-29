# --- Stage 1: Build the Angular app ---
FROM node:20 AS build
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build --prod

# --- Stage 2: Serve via NGINX ---
FROM nginx:stable-alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html


# Expose port 80
EXPOSE 80

# Run NGINX
CMD ["nginx", "-g", "daemon off;"]
