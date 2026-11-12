FROM node:22.23.4-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS builder
COPY . .
RUN npm run build:ssr

FROM node:22.23.4-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=4000
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 4000
USER node
CMD ["npm", "run", "serve:ssr"]
