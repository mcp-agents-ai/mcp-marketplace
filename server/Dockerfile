# Dockerfile for the server
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure the data directory and split folder are copied to the dist folder
COPY src/data/mcp-servers.json dist/data/mcp-servers.json
# Create split directory if it doesn't exist
RUN mkdir -p dist/data/split
# Copy all files from split directory
COPY src/data/split/*.json dist/data/split/

# Build the application
RUN npm run build

# Expose port 3001
EXPOSE 3001

# Start the server
CMD ["npm", "start"]