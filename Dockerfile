FROM node:17-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENV PORT=3000

EXPOSE $PORT
CMD ["npm", "start"]
