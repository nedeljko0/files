FROM node:20

WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY yarn.lock ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/frontend/package*.json ./packages/frontend/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/frontend ./packages/frontend

# Build shared package
RUN cd packages/shared && yarn build

# Set working directory to frontend
WORKDIR /app/packages/frontend

# Expose port
EXPOSE 3000

# Start the app in development mode
CMD ["sh", "-c", "yarn install && yarn dev --host"]