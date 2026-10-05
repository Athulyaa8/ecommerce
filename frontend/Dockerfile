# ==============================================================================
# Step 2: Frontend Dockerfile (Vite + React 18 + Nginx)
# Multi-stage build: Compiles React with Node.js, then serves with Nginx
# ==============================================================================

# Stage 1: Build the React static files
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and run production build
COPY . .
RUN npm run build

# Stage 2: Serve static files with lightweight Nginx
FROM nginx:alpine

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx routing config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx serves on standard HTTP port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
