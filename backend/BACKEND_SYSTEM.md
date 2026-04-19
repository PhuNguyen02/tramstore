# TramStore - Backend System Documentation

## 1. Tổng quan (Overview)
Hệ thống Backend của TramStore được xây dựng theo kiến trúc Microservices đơn giản, tập trung vào việc quản lý danh mục sản phẩm dịch vụ số (AI Tools, Entertainment, Work & Design, v.v.). Hệ thống cung cấp các API RESTful cho Frontend và quản lý dữ liệu thông qua Prisma ORM.

## 2. Công nghệ sử dụng (Tech Stack)
- **Framework**: [NestJS](https://nestjs.com/) (Node.js framework)
- **Ngôn ngữ**: TypeScript
- **Cơ sở dữ liệu**: SQLite (sử dụng thông qua `better-sqlite3`)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Cấu hình**: NestJS ConfigModule (sử dụng file `.env`)
- **Phục vụ file tĩnh**: Express Static (để host ảnh sản phẩm)

## 3. Cấu trúc thư mục chính
- `src/`: Chứa mã nguồn logic của ứng dụng.
  - `main.ts`: Điểm khởi đầu, cấu hình CORS, prefix và static assets.
  - `app.module.ts`: Root module kết nối các module chức năng.
  - `products/`: Module quản lý sản phẩm.
  - `categories/`: Module quản lý danh mục.
  - `prisma/`: Module kết nối CSDL.
- `prisma/`: Chứa schema định nghĩa CSDL và các file migration.
- `public/`: Thư mục chứa các tệp tin tĩnh (hình ảnh sản phẩm).
- `data-product-mock.json` (từ Frontend): Nguồn dữ liệu mẫu để Seed vào DB.

## 4. Mô hình dữ liệu (Database Schema)
Hệ thống sử dụng mô hình 1-N giữa Danh mục và Sản phẩm, và 1-N giữa Sản phẩm và Biến thể.

### Category (Danh mục)
- `id`: UUID
- `name`: Tên danh mục (ví dụ: AI Tools)
- `slug`: Unique slug để truy cập URL.

### Product (Sản phẩm chính)
- `name`: Tên sản phẩm (ví dụ: ChatGPT)
- `brand`: Thương hiệu (ví dụ: chatgpt)
- `images`: Mảng chứa URL hình ảnh.
- `price`: Giá thấp nhất hiển thị.
- `tag`: Nhãn nổi bật (Hot Deal, Trending).

### Variant (Biến thể/Gói dịch vụ)
- `name`: Tên biến thể (ví dụ: ChatGPT Plus 1 tháng)
- `price`: Giá riêng của gói.
- `features`: Danh sách tính năng (dạng JSON).
- `warranties`: Thông tin bảo hành.

## 5. Các API Endpoints
Tất cả các API được bắt đầu bằng tiền tố `/api/v1`.

### Products
- `GET /api/v1/products`: Lấy danh sách toàn bộ sản phẩm (đã gộp biến thể).
- `GET /api/v1/products/:slug`: Chi tiết sản phẩm kèm theo tất cả biến thể.
- `GET /api/v1/products/search?q=...`: Tìm kiếm sản phẩm theo tên.
- `GET /api/v1/products/category/:slug`: Lấy sản phẩm thuộc một danh mục.

### Categories
- `GET /api/v1/categories`: Lấy danh sách các danh mục.

### Static Assets
- `GET /:filename`: Truy cập trực tiếp ảnh sản phẩm (ví dụ: `/chatgpt-icon.webp`).

## 6. Hệ thống Seed & Đồng bộ
Backend có một cơ chế Seed đặc biệt (`prisma/seed.ts`):
1. Đọc dữ liệu từ `frontend/src/mock/data-product-mock.json`.
2. Tự động gộp các dòng dữ liệu lẻ thành một Sản phẩm lớn duy nhất dựa trên `brand`.
3. Đồng bộ hóa toàn bộ ảnh từ `frontend/public` sang `backend/public` để Backend có thể tự host ảnh.

## 7. Cấu hình môi trường (.env)
- `PORT`: Mặc định 4000.
- `DATABASE_URL`: Đường dẫn file SQLite.
- `CORS_ORIGIN`: Mặc định `http://localhost:3000`.
- `API_PREFIX`: Mặc định `api/v1`.

---
*Tài liệu này được cập nhật tự động bởi hệ thống hỗ trợ Antigravity.*
