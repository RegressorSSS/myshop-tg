// src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_URL; // https://gasuboots.ru/api

export const api = {
  products: {
    list: (params?: URLSearchParams) => {
      const url = params ? `${API_BASE}/products?${params}` : `${API_BASE}/products`;
      return fetch(url);
    },
    get: (id: string) => fetch(`${API_BASE}/products/${id}`),
    create: (data: any, initData?: string) => fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(initData && { 'X-Telegram-Init-Data': encodeURIComponent(initData) })
      },
      body: JSON.stringify(data)
    }),
    update: (id: string, data: any, initData?: string) => fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(initData && { 'X-Telegram-Init-Data': encodeURIComponent(initData) })
      },
      body: JSON.stringify(data)
    }),
    delete: (id: string, initData?: string) => fetch(`${API_BASE}/products/${id}`, { 
      method: 'DELETE',
      headers: {
        ...(initData && { 'X-Telegram-Init-Data': encodeURIComponent(initData) })
      }
    })
  },
  upload: (formData: FormData) => fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  }),
  orders: {
    create: (data: any, initData?: string) => fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(initData && { 'X-Telegram-Init-Data': encodeURIComponent(initData) })
      },
      body: JSON.stringify(data)
    })
  }
};