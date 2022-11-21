FROM node:18-alpine3.16

EXPOSE 3000
WORKDIR /app

COPY package*.json /app
RUN npm ci --only=production && npm cache clean --force
COPY . /app

CMD ["node", "index.js"]
