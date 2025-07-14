# Stage 1: Build the React application
FROM node:20-alpine as build

# Set the working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Build arguments for backend URL
ARG BACKEND_URL

# Set environment variables for build
ENV VITE_BACKEND_URL=${BACKEND_URL}

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Build argument for nginx configuration
ARG BACKEND_URL

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the nginx configuration template
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Generate the actual nginx configuration from template
RUN BACKEND_URL=${BACKEND_URL} envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Remove the template file
RUN rm /etc/nginx/conf.d/default.conf.template

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
