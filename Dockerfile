FROM node:17

RUN apt-get install fontconfig

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENV PORT=3000

EXPOSE $PORT
CMD ["npm", "start"]
