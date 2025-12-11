# Stage 1: Build the React application
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Build the application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine as production-stage
# Copy the built React application files
COPY --from=build-stage /app/build /usr/share/nginx/html
# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add custom Nginx config to serve the React app and proxy the API calls to the backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]