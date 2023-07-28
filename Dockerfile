# Build stage for React app
FROM mcr.microsoft.com/playwright:v1.36.1
COPY . .
RUN npm install
CMD ["npx", "playwright", "test"]