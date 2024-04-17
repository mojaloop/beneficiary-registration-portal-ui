# Use Node.js LTS version as the base image
FROM node:lts-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the entire project to the working directory
COPY . .

# Build the React app
RUN npm run build

# Use a smaller base image for the runtime
FROM nginx:alpine

# Copy the built React app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port your React app is running on
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]