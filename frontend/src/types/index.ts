export interface User {
  id?: number
  username: string
  email?: string
  full_name?: string
  role?: 'admin' | 'manager' | 'staff'
  is_active?: boolean
  created_at?: string
  updated_at?: string | null
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface Product {
  id: number
  kode: string
  nama: string
  kategori: string
  harga_beli: number
  harga_jual: number
  stok: number
  stok_minimum: number
  satuan: string
  image_url?: string | null
  deskripsi?: string | null
  status: string
  created_at: string
  updated_at?: string | null
}

export interface Transaction {
  id: number
  nomor: string
  tipe: 'penjualan' | 'pembelian' | 'return'
  product_id: number
  user_id: number
  jumlah: number
  harga_satuan: number
  total_harga: number
  jenis_pembayaran?: string | null
  status: string
  tanggal_transaksi?: string
  created_at: string
  product?: Product | null
  user_name?: string | null
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ProductFormData {
  kode: string
  nama: string
  kategori: string
  harga_beli: number
  harga_jual: number
  stok: number
  stok_minimum: number
  satuan: string
  image_base64?: string
  deskripsi?: string
  status: string
}

export interface TransactionFormData {
  tipe: 'penjualan' | 'pembelian' | 'return'
  product_id: number
  jumlah: number
  harga_satuan: number
  jenis_pembayaran?: string
}

export interface UserFormData {
  username: string
  email: string
  full_name: string
  password?: string
  role: 'admin' | 'manager' | 'staff'
  is_active: boolean
}

export interface Kategori {
  id: number
  kode: string
  nama: string
  deskripsi?: string | null
  created_at: string
  updated_at?: string | null
}
