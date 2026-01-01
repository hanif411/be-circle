# Step 1: Base image
FROM node:18-alpine

RUN apk add --no-cache openssl

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Step 4: Install dependencies
RUN npm install

# Step 5: Generate Prisma Client
RUN npx prisma generate

# Step 6: Copy source code & tsconfig
COPY . .

# Step 7: Build TypeScript ke JavaScript
RUN npm run build

# Step 8: Expose port (sesuai app.ts lu)
EXPOSE 3000

# Step 9: Jalankan aplikasi dari folder dist
CMD ["npm", "run", "start"]