# ---- builder ----
FROM node:24-alpine AS builder

WORKDIR /build

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run build

RUN mkdir -p nm_prod/
COPY package*.json nm_prod/
RUN npm ci --omit=dev --ignore-scripts --prefix=nm_prod

# ---- runtime ----
FROM node:24-alpine

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/nm_prod/node_modules ./node_modules
COPY --from=builder /build/package.json ./

EXPOSE 3000

CMD ["node", "dist/index.js"]