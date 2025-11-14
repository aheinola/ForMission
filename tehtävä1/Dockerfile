# Builder: build frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci
COPY frontend ./frontend
RUN cd frontend && npm run build

# Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
# copy built frontend
COPY --from=builder /app/frontend/dist ./frontend/dist
# copy server and other files
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]