# Step 1: Build app with Node.js
FROM node:18 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Set environment variables for Vite build
ENV VITE_BASE_API=https://money-tracking-backend-cgoe.onrender.com
ENV VITE_CLIENT_ID=244191614923-f068pao61n37bmq358f5o9p9kr5l18t5.apps.googleusercontent.com

RUN npm run build

# Step 2: Serve with nginx
FROM nginx:alpine

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Replace default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

