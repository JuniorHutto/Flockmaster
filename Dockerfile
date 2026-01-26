# Multi-stage Dockerfile for FlockMaster (static site built with Vite)

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (including dev deps required to build)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy compiled static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Use a custom nginx config (overrides default.conf)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
