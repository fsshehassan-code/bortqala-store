FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate --schema=server/prisma/schema.prisma

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
