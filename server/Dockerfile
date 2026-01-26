FROM node:20-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Standard port for Node APIs
EXPOSE 3000

# Use 'node' for production, but for dev you'll likely use 'nodemon'
CMD ["nodemon", "index.js"]
