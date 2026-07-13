/// <reference types="vite/client" />

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'staff';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  kode: string;
  nama: string;
  kategori: string;
  harga_beli: number;
  harga_jual: number;
  stok: number;
  stok_minimum: number;
  satuan: string;
  deskripsi?: string;
  status: 'aktif' | 'tidak_aktif' | 'habis';
  created_at: string;
  updated_at?: string;
}

export interface Transaction {
  id: number;
  nomor: string;
  tipe: 'pembelian' | 'penjualan' | 'return';
  product_id: number;
  user_id: number;
  jumlah: number;
  harga_satuan: number;
  total_harga: number;
  tanggal_transaksi: string;
  jenis_pembayaran?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  product?: Product;
  user_name?: string;
}

export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface FilterParams {
  page?: number;
  page_size?: number;
  q?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}
