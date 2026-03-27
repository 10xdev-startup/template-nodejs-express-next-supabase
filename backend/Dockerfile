# Backend Dockerfile - Node.js com Express e TypeScript
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat wget

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev && npm cache clean --force

# Build stage
FROM base AS builder
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 apiuser

COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN mkdir -p /app/logs && chown apiuser:nodejs /app/logs

USER apiuser

EXPOSE 8000

CMD ["npm", "start"]
