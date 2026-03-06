# --- Builder Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npm prune --production


# --- Production Stage ---
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    cairo \
    pango \
    jpeg \
    giflib

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/grpc/*.proto ./dist/grpc/
COPY --from=builder /app/src/assets ./dist/assets
COPY .env ./

EXPOSE 3000
EXPOSE 50051

CMD ["node", "dist/server.js"]