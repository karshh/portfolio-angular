FROM node:16.20.2-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/dist/* /usr/share/nginx/html/
