# Stage 1: Build Node.js application
FROM node:20-slim as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Stage 2: Final image
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3001
CMD ["node", "server.js"]