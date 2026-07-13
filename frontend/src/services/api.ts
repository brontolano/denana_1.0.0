import axios from 'axios'
import type { User, Product, Transaction, PaginatedResponse, LoginResponse, ProductFormData, TransactionFormData, UserFormData, Kategori } from '../types'

export const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('den-ana-auth')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      const token = parsed?.state?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      console.error('Failed to parse auth token', e)
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('den-ana-auth')
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  login: async (username: string, password: string) => {
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)
    const res = await api.post<LoginResponse>('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return res.data
  },
  register: async (data: { username: string; email: string; full_name: string; password: string; role?: string }) => {
    const res = await api.post<User>('/auth/register', data)
    return res.data
  },
  getUsers: async (params?: { page?: number; page_size?: number; q?: string; role?: string; sort_by?: string; sort_dir?: string }) => {
    const res = await api.get<PaginatedResponse<User>>('/auth/users', { params })
    return res.data
  },
  getUser: async (id: number) => {
    const res = await api.get<User>(`/auth/users/${id}`)
    return res.data
  },
  updateUser: async (id: number, data: Partial<UserFormData>) => {
    const res = await api.put<User>(`/auth/users/${id}`, data)
    return res.data
  },
  deleteUser: async (id: number) => {
    const res = await api.delete(`/auth/users/${id}`)
    return res.data
  },
}

export const productApi = {
  getProducts: async (params?: { page?: number; page_size?: number; q?: string; status?: string; kategori?: string; stok_below?: number; sort_by?: string; sort_dir?: string }) => {
    const res = await api.get<PaginatedResponse<Product>>('/products', { params })
    return res.data
  },
  getProduct: async (id: number) => {
    const res = await api.get<Product>(`/products/${id}`)
    return res.data
  },
  createProduct: async (data: ProductFormData) => {
    const res = await api.post<Product>('/products', data)
    return res.data
  },
  updateProduct: async (id: number, data: Partial<ProductFormData>) => {
    const res = await api.put<Product>(`/products/${id}`, data)
    return res.data
  },
  deleteProduct: async (id: number) => {
    const res = await api.delete(`/products/${id}`)
    return res.data
  },
}

export const dashboardApi = {
  getStats: async () => {
    const [productsRes, transactionsRes, usersRes, lowStockRes] = await Promise.all([
      productApi.getProducts({ page_size: 1 }),
      transactionApi.getTransactions({ page_size: 1 }),
      authApi.getUsers({ page_size: 1 }),
      productApi.getProducts({ page_size: 1, stok_below: 5 })
    ])
    return {
      totalProducts: productsRes.total,
      totalTransactions: transactionsRes.total,
      totalUsers: usersRes.total,
      totalRevenue: 0,
      lowStockProducts: lowStockRes.total
    }
  },
}

export const transactionApi = {
  getTransactions: async (params?: { page?: number; page_size?: number; tipe?: string; status?: string; q?: string; sort_by?: string; sort_dir?: string }) => {
    const res = await api.get<PaginatedResponse<Transaction>>('/transactions', { params })
    return res.data
  },
  getTransaction: async (id: number) => {
    const res = await api.get<Transaction>(`/transactions/${id}`)
    return res.data
  },
  createTransaction: async (data: TransactionFormData) => {
    const res = await api.post<Transaction>('/transactions', data)
    return res.data
  },
  updateTransaction: async (id: number, data: { status?: string }) => {
    const res = await api.put<Transaction>(`/transactions/${id}`, data)
    return res.data
  },
  deleteTransaction: async (id: number) => {
    const res = await api.delete(`/transactions/${id}`)
    return res.data
  },
}

export const kategoriApi = {
  getKategoris: async (params?: { page?: number; page_size?: number }) => {
    const res = await api.get<PaginatedResponse<Kategori>>('/kategoris', { params })
    return res.data
  },
  getKategori: async (id: number) => {
    const res = await api.get<Kategori>(`/kategoris/${id}`)
    return res.data
  },
  createKategori: async (data: { kode: string; nama: string; deskripsi?: string }) => {
    const res = await api.post<Kategori>('/kategoris', data)
    return res.data
  },
  updateKategori: async (id: number, data: Partial<{ kode: string; nama: string; deskripsi?: string }>) => {
    const res = await api.put<Kategori>(`/kategoris/${id}`, data)
    return res.data
  },
  deleteKategori: async (id: number) => {
    const res = await api.delete(`/kategoris/${id}`)
    return res.data
  },
}

export default api;

export const publicApi = {
  getProducts: async (params?: { page?: number; page_size?: number; kategori?: string; q?: string }) => {
    const res = await api.get<PaginatedResponse<Product>>('/public/products', { params })
    return res.data
  },
  createOrder: async (data: {
    product_id: number
    jumlah: number
    harga_satuan: number
    customer_name: string
    customer_phone: string
    customer_email?: string
    customer_address?: string
    notes?: string
  }) => {
    const res = await api.post('/public/orders', { ...data, tipe: 'penjualan', jenis_pembayaran: 'cash' })
    return res.data
  }
}
