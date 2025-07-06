# Use Node.js 18 as the base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install production dependencies
RUN npm install --production

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["node", "--experimental-specifier-resolution=node", "dist/index.js"]
