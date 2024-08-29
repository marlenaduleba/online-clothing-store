# Use the Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Set the environment variable
ENV NODE_ENV=${NODE_ENV}

# Expose the application port
EXPOSE 3000

# Command to run the app in different environments
CMD if [ "${NODE_ENV}" = "development" ]; then npm run dev; else npm run start; fi
