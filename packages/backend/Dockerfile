FROM node:18

WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY yarn.lock ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/backend/package*.json ./packages/backend/

# Copy source code first so we can build
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend

# Install all dependencies and build shared
RUN yarn install --frozen-lockfile
RUN cd packages/shared && yarn build

WORKDIR /app/packages/backend

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

CMD npx prisma generate && npx prisma migrate deploy && yarn start