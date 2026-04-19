const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  stock: number;
  images: string | null; // JSON string
  status: string;
  tag: string | null;
  brand: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: {
    id: string;
    name: string;
    price: number;
    originalPrice: number | null;
    discount: number | null;
    stock: number;
    description: string | null;
    features: string | null;   // JSON string
    warranties: string | null; // JSON string
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

// ═══════════════════════════════════════════════════════════
// 🛒 Order & Payment Types
// ═══════════════════════════════════════════════════════════

export interface CreateOrderPayload {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  productId: string;
  variantId: string;
  paymentMethod?: string;
  note?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  status: string;
  qrData: string;        // VietQR image URL
  bankInfo: {
    bankName: string;
    bankBin: string;
    accountNumber: string;
    accountName: string;
    transferContent: string;
    amount: number;
    qrUrl: string;
  };
  expiredAt: string;
}

export interface OrderDetail {
  id: string;
  status: string; // PENDING | AWAITING_PAYMENT | PAID | FAILED | EXPIRED | CANCELLED | COMPLETED
  customerEmail: string;
  customerName: string | null;
  customerPhone: string | null;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  expiredAt: string | null;
  payments: {
    id: string;
    method: string;
    status: string;
    gatewayTxId: string | null;
    amount: number;
  }[];
}

export const api = {
  products: {
    getAll: async (): Promise<ApiProduct[]> => {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },

    getBySlug: async (slug: string): Promise<ApiProduct> => {
      const res = await fetch(`${API_BASE}/products/${slug}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    },

    getByCategory: async (categorySlug: string): Promise<ApiProduct[]> => {
      const res = await fetch(`${API_BASE}/products/category/${categorySlug}`);
      if (!res.ok) throw new Error('Failed to fetch products by category');
      return res.json();
    },

    search: async (query: string): Promise<ApiProduct[]> => {
      const res = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
  },

  categories: {
    getAll: async (): Promise<ApiCategory[]> => {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
  },

  // ═══════════════════════════════════════════════════════
  // 🛒 Orders API
  // ═══════════════════════════════════════════════════════
  orders: {
    /**
     * Tạo đơn hàng mới → nhận QR VietQR + thông tin chuyển khoản
     */
    create: async (data: CreateOrderPayload): Promise<CreateOrderResponse> => {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to create order');
      }
      return res.json();
    },

    /**
     * Lấy chi tiết đơn hàng (dùng cho polling trạng thái thanh toán)
     */
    getById: async (id: string): Promise<OrderDetail> => {
      const res = await fetch(`${API_BASE}/orders/${id}`);
      if (!res.ok) throw new Error('Order not found');
      return res.json();
    },

    /**
     * Huỷ đơn hàng
     */
    cancel: async (id: string): Promise<OrderDetail> => {
      const res = await fetch(`${API_BASE}/orders/${id}/cancel`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Failed to cancel order');
      return res.json();
    },
  },
};
