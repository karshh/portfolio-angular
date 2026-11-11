FROM node:22.23.4-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/dist/* /usr/share/nginx/html/
