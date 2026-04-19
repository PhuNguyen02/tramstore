# TramStore — Hệ thống thanh toán VietQR + SePay

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Luồng nghiệp vụ 12 bước](#2-luồng-nghiệp-vụ-12-bước)
3. [Trạng thái đơn hàng](#3-trạng-thái-đơn-hàng)
4. [API Endpoints](#4-api-endpoints)
5. [VietQR Gateway](#5-vietqr-gateway)
6. [SePay Webhook](#6-sepay-webhook)
7. [Cấu hình môi trường](#7-cấu-hình-môi-trường)
8. [Hướng dẫn triển khai](#8-hướng-dẫn-triển-khai)

---

## 1. Tổng quan kiến trúc

```
Frontend (Next.js)
    │
    │  POST /api/v1/orders
    ▼
OrdersController  ────────►  PaymentService
    │                               │
    │ tạo Order (PENDING)           │ tạo VietQR URL
    ▼                               ▼
  SQLite DB                  VietQR Gateway
                            (img.vietqr.io)
                                    │
                  Khách quét QR → chuyển khoản qua Banking App
                                    │
                                    ▼
                    SePay phát hiện biến động số dư
                                    │ POST /api/v1/webhooks/sepay
                                    ▼
                           WebhookController
                                    │ xác thực API key
                                    │ đối soát nội dung CK + số tiền
                                    ▼
                           Order: PAID
                                    │
                                    ├──► NotificationService → Admin (log/telegram)
                                    └──► Email xác nhận → Khách hàng
                                              │
                              Admin gửi account qua email
                                              │
                                    PATCH /orders/:id/complete
                                              │
                                    Order: COMPLETED
```

**Nguyên tắc cốt lõi:**

- Đơn hàng tạo ra với trạng thái `PENDING` — không bao giờ tự chuyển thành `PAID` từ phía client.
- Trạng thái chỉ được cập nhật bởi server sau khi nhận webhook từ SePay.
- VietQR chỉ tạo QR code (không có API riêng), SePay đảm nhận phần webhook.
- Payment frontend poll trạng thái đơn hàng mỗi 5 giây, tự redirect khi PAID.

---

## 2. Luồng nghiệp vụ 12 bước

| Step | Mô tả | Thành phần |
|------|--------|------------|
| **1** | Khách chọn sản phẩm | Frontend — Product Page |
| **2** | Thêm vào giỏ hàng | Frontend — Cart Store |
| **3** | Vào giỏ hàng thanh toán hoặc "Mua ngay" | Frontend — Cart/Product Page |
| **4** | Điền thông tin: tên, SĐT, email (bắt buộc) | Frontend — Checkout Step 1 |
| **5** | Xác nhận đơn hàng | Frontend — Checkout Step 2 |
| **6** | Bấm thanh toán → POST /orders | Frontend → Backend API |
| **7** | Hiển thị QR VietQR + thông tin chuyển khoản | Frontend — Payment Page |
| **8** | SePay webhook → trạng thái PAID → thông báo khách | Backend Webhook → Email |
| **9** | Webhook thông báo admin có đơn mới | Backend → Admin (log/telegram) |
| **10** | Admin gửi account qua email khách hàng | Admin → Email (thủ công) |
| **11** | Đơn hàng chuyển trạng thái COMPLETED | Backend — PATCH /orders/:id/complete |
| **12** | Khách nhắn tin support 24/7 | Frontend — Chat widget |

---

## 3. Trạng thái đơn hàng

```
PENDING  ──► AWAITING_PAYMENT  ──► PAID  ──► COMPLETED
                                ├──► FAILED
                                └──► EXPIRED
```

| Trạng thái | Mô tả |
|------------|--------|
| `PENDING` | Đơn mới tạo, chờ khởi tạo thanh toán |
| `AWAITING_PAYMENT` | Đã tạo QR VietQR, chờ khách chuyển khoản |
| `PAID` | SePay webhook xác nhận thanh toán thành công |
| `COMPLETED` | Admin đã gửi account cho khách, đơn hoàn tất |
| `FAILED` | Thanh toán thất bại |
| `EXPIRED` | Hết thời gian thanh toán (15 phút) |
| `CANCELLED` | Khách huỷ đơn thủ công |
| `REFUNDED` | Đã hoàn tiền |

---

## 4. API Endpoints

### Orders
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `POST` | `/api/v1/orders` | Tạo đơn hàng + QR VietQR |
| `GET` | `/api/v1/orders/:id` | Chi tiết đơn hàng (polling) |
| `GET` | `/api/v1/orders?email=...` | Danh sách đơn theo email |
| `PATCH` | `/api/v1/orders/:id/cancel` | Huỷ đơn hàng |
| `PATCH` | `/api/v1/orders/:id/complete` | Hoàn tất đơn (admin) |

### Webhooks
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `POST` | `/api/v1/webhooks/sepay` | SePay webhook |
| `POST` | `/api/v1/webhooks/bank-transfer/confirm` | Xác nhận thủ công (admin) |

---

## 5. VietQR Gateway

### Tạo QR URL

```
https://img.vietqr.io/image/{BIN}-{ACCOUNT}-{TEMPLATE}.png
  ?amount={AMOUNT}
  &addInfo={TRANSFER_CONTENT}
  &accountName={ACCOUNT_NAME}
```

**Ví dụ:**
```
https://img.vietqr.io/image/970422-0123456789-compact2.png
  ?amount=299000
  &addInfo=TSABCD1234
  &accountName=TRAM%20STORE
```

### Nội dung chuyển khoản

Format: `TS{8 ký tự cuối orderId}` (viết hoa, bỏ dấu -)

Ví dụ: orderId = `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
→ Nội dung CK = `TS34567890`

---

## 6. SePay Webhook

### Payload format

```json
{
  "id": 92704,
  "gateway": "MBBank",
  "transactionDate": "2026-04-14 14:02:37",
  "accountNumber": "0123456789",
  "transferAmount": 299000,
  "content": "TSABCD1234 chuyen tien",
  "code": "TSABCD1234",
  "referenceCode": "208V009252001511",
  "transferType": "in"
}
```

### Luồng xử lý webhook

1. **Xác thực**: Kiểm tra API Key trong header `Authorization: Apikey {key}`
2. **Lọc**: Chỉ xử lý `transferType === "in"`
3. **Tìm đơn**: Parse nội dung CK → tìm Payment record theo `gatewayTxId`
4. **Đối soát**: So khớp `transferAmount` với `payment.amount` (±1đ)
5. **Cập nhật**: Order → `PAID`, Payment → `COMPLETED`
6. **Thông báo**: Emit event `order.paid` → NotificationService

### Response

```json
{ "success": true }
```

Luôn trả HTTP 200 để SePay không retry.

---

## 7. Cấu hình môi trường

```env
# VietQR
VIETQR_BANK_BIN=970422            # Mã BIN ngân hàng
VIETQR_ACCOUNT_NUMBER=0123456789  # Số tài khoản
VIETQR_ACCOUNT_NAME=TRAM STORE    # Tên tài khoản
VIETQR_BANK_NAME=MB Bank          # Tên ngân hàng
VIETQR_TEMPLATE=compact2          # Template QR

# SePay
SEPAY_WEBHOOK_SECRET=xxx           # API Key từ SePay dashboard
```

### Danh sách BIN ngân hàng phổ biến

| Ngân hàng | BIN |
|-----------|-----|
| MB Bank | 970422 |
| Vietcombank | 970436 |
| Techcombank | 970407 |
| BIDV | 970418 |
| ACB | 970416 |
| TPBank | 970423 |
| VPBank | 970432 |
| Sacombank | 970403 |

---

## 8. Hướng dẫn triển khai

### Bước 1: Cấu hình VietQR
1. Cập nhật `.env` với thông tin tài khoản ngân hàng thực
2. Kiểm tra QR URL bằng cách mở trực tiếp URL trong trình duyệt

### Bước 2: Đăng ký SePay
1. Đăng ký tại [my.sepay.vn](https://my.sepay.vn) (production) hoặc [my.dev.sepay.vn](https://my.dev.sepay.vn) (sandbox)
2. Liên kết tài khoản ngân hàng
3. Cấu hình Webhook:
   - URL: `https://your-domain.com/api/v1/webhooks/sepay`
   - Sự kiện: "Có tiền vào"
   - Chứng thực: API Key
   - Lọc: "Bỏ qua nếu nội dung không có Code thanh toán"
4. Copy API Key → paste vào `SEPAY_WEBHOOK_SECRET` trong `.env`

### Bước 3: Test end-to-end
1. Tạo đơn hàng test (sản phẩm 1,000đ)
2. Quét QR → chuyển khoản
3. Kiểm tra log backend: `✅ Order xxx → PAID`
4. Kiểm tra frontend: tự redirect sang trang thành công

### Bước 4: Expose webhook (development)
```bash
# Dùng ngrok để expose localhost
ngrok http 4000

# Hoặc dùng Cloudflare Tunnel
cloudflared tunnel --url http://localhost:4000
```

Cập nhật Webhook URL trên SePay dashboard với URL ngrok/cloudflare.

---

_Tài liệu cập nhật: 2026-04-14_
_Hệ thống: VietQR (QR) + SePay (Webhook) — thay thế PayOS_
