FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copy source sau khi install
COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
