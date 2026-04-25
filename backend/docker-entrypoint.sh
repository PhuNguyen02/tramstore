#!/bin/sh

# Chạy migrations để đảm bảo database schema mới nhất
echo "Running prisma db push..."
npx prisma db push --accept-data-loss

# Bạn có thể thêm lệnh seed ở đây nếu muốn
# echo "Running seed..."
# npx prisma db seed

# Khởi động ứng dụng
echo "Starting application..."
node dist/src/main.js
