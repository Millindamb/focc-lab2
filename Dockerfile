# stage 1: build React
FROM node:20-alpine AS client
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# stage 2: production deps only
FROM node:20-alpine AS deps
WORKDIR /app
COPY server/package*.json ./
RUN npm install --omit=dev

# stage 3: slim runtime
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY server/server.js ./
COPY --from=client /client/dist ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]