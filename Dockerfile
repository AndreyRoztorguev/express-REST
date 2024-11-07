
ARG NODE_VERSION

FROM node:${NODE_VERSION}-alpine as base

# PROD STAGE
FROM base as prod

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY . .

# CMD ["npm", "start"]

# # DEV STAGE
# FROM base as dev

# # Download dependencies as a separate step to take advantage of Docker's caching.
# # Leverage a cache mount to /root/.npm to speed up subsequent builds.
# # Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# # into this layer.

# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci --include=dev

# # Copy the rest of the source files into the image.
# COPY . .

# # Run the application.
# CMD ["npm", "run", "dev"]

# # TEST STAGE

# FROM base as test

# ENV NODE_ENV test

# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci --include=dev

# USER node

# COPY . .

# RUN npm run test