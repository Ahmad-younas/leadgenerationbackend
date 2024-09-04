# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code into the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Use a smaller base image for production
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the built files and node_modules from the build stage
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Expose the port your application runs on
EXPOSE 5000

# Set the default command to start your server
CMD ["node", "build/index.js"]