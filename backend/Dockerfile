# Use Node.js LTS version as the base image
FROM node:18.17.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
#RUN npm ci --only=production

# Install ts-node as a development dependency
RUN npm install --only=dev ts-node

# Copy the entire project to the working directory
COPY . .

# Set the NODE_ENV environment variable
ENV NODE_ENV=production

# Expose the port your Node.js app is running on (change this if your app runs on a different port)
EXPOSE 8080

# Start the Node.js app using ts-node
CMD ["node", "--loader=ts-node/esm", "src/index.ts"]