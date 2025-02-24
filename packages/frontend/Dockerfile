FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN yarn install && \
    yarn global add vite@4.0.0

# Copy the rest of the code
COPY . .

EXPOSE 3000

# Set host to allow external connections
ENV HOST=0.0.0.0

CMD ["yarn", "dev", "--host"]
