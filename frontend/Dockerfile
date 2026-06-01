FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

# コンテナ外（ブラウザ）からアクセスできるよう 0.0.0.0 で待ち受け
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]
