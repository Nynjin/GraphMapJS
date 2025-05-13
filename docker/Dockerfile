FROM node:lts-alpine

# STAGE 1: Install dependencies
FROM node:lts-alpine AS base

# Install dependencies
RUN apk update

WORKDIR /app

COPY . /app



# STAGE 2: Build the app
FROM base AS build

# Run the app
ENTRYPOINT npm run build -- -p ${PORT}


# STAGE 2: Run the app as dev
FROM base AS dev

# Run the app
ENTRYPOINT npm run dev -- -p ${PORT}



# STAGE 3: Test the app
FROM build AS test

# Run the app
ENTRYPOINT npm run test -- -p ${PORT}



# STAGE 4: Run the app
FROM build AS start

# Run the app
ENTRYPOINT npm run start -- -p ${PORT}