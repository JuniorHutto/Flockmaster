# Multi-stage Dockerfile for FlockMaster v2 (static site built with Vite)

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (including dev deps required to build)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy compiled static files
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy public assets (served from web root)
COPY --from=builder /app/public /usr/share/nginx/html

# Use a custom nginx config (overrides default.conf)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Ensure static image is available at runtime (fallback if not in public)
COPY sheep.jpg /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
