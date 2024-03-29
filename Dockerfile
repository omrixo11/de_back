# Step 1: Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Install project dependencies
RUN npm cache clean --force && npm install

# Bundle app source inside Docker image
COPY . .

# Build the application
RUN npm run build

# Your application runs on port 5001. Use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 5001

# Define the command to run the app
CMD ["npm", "run", "start:prod"]
