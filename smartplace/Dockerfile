# 1. Use a lightweight Node.js image
FROM node:20-alpine

# 2. Create a directory for the app code
WORKDIR /app

# 3. Copy ONLY the package files first
# This is a "pro move" so Docker doesn't re-install your 
# libraries every time you change a single line of CSS.
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your frontend code
COPY . .

# 6. Vite's default port
EXPOSE 5173

# 7. Start the development server
# The "--host" part is the most important—it lets you 
# access the app from outside the container.
CMD ["npm", "run", "dev", "--", "--host"]
