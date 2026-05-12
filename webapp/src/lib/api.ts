// src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_URL;

export const api = {
  products: {
    list: () => fetch(`${API_BASE}/api/products`),
    get: (id: string) => fetch(`${API_BASE}/api/products/${id}`),
    create: (data: any) => fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    update: (id: string, data: any) => fetch(`${API_BASE}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    delete: (id: string) => fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' })
  },
  upload: (formData: FormData) => fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData
  }),
  orders: {
    create: (data: any) => fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }
};