# Build stage for React app
FROM mcr.microsoft.com/playwright:v1.36.1
WORKDIR /app
COPY package.json /app/package.json
COPY ../package.json /app/package.json
COPY . .
RUN npm install
