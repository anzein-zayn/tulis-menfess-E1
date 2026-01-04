# Gunakan Node.js versi LTS
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy semua file aplikasi
COPY . .

# Expose port
EXPOSE 1912

# Command untuk menjalankan aplikasi
CMD ["node", "app.js"]
