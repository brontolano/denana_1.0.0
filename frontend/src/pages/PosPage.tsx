import { useState, useEffect, useCallback } from 'react'
import { productApi, transactionApi, kategoriApi } from '../services/api'
import { PrintService } from '../services/printService'
import { showToast } from '../components/Toast'
import type { Product } from '../types'

interface CartItem {
  product: Product
  quantity: number
}

export function PosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<{ kode: string; nama: string }[]>([])
  const [paymentType, setPaymentType] = useState('cash')
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<{ nomor: string; total: number; items: CartItem[] } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
    kategoriApi.getKategoris({ page_size: 100 }).then(d => setCategories(d.items || [])).catch(() => {})
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const params: Record<string, unknown> = { page_size: 50 }
      if (search) params.q = search
      if (category) params.kategori = category
      const data = await productApi.getProducts(params)
      setProducts(data.items || [])
    } catch { setProducts([]) }
  }, [search, category])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id)
      if (existing) {
        return prev.map(c => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c)
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.product.id !== productId) return c
      const newQty = c.quantity + delta
      return newQty <= 0 ? null : { ...c, quantity: newQty }
    }).filter(Boolean) as CartItem[])
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(c => c.product.id !== productId))
  }

  const subtotal = cart.reduce((sum, c) => sum + c.product.harga_jual * c.quantity, 0)

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setLoading(true)
    try {
      let lastNomor = ''
      for (const c of cart) {
        const res = await transactionApi.createTransaction({
          tipe: 'penjualan',
          product_id: c.product.id,
          jumlah: c.quantity,
          harga_satuan: c.product.harga_jual,
          jenis_pembayaran: paymentType,
        })
        lastNomor = res.nomor
      }
      setLastTransaction({ nomor: lastNomor, total: subtotal, items: [...cart] })
      setShowReceipt(true)
      setCart([])
      showToast(`Transaksi ${lastNomor} berhasil!`, 'success')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      showToast(axiosErr?.response?.data?.detail || 'Gagal memproses transaksi', 'error')
    } finally {
      setLoading(false)
    }
  }

  const printReceipt = () => {
    if (!lastTransaction) return
    const content = PrintService.formatReceipt({
      transactionNumber: lastTransaction.nomor,
      date: new Date().toLocaleString('id-ID'),
      storeName: 'Den Ana',
      items: lastTransaction.items.map(c => ({
        name: c.product.nama,
        quantity: c.quantity,
        price: c.product.harga_jual,
        total: c.product.harga_jual * c.quantity,
      })),
      subtotal: lastTransaction.total,
      paymentType,
    })
    PrintService.printReceipt(content)
  }

  return (
    <div className="flex h-screen">
      {/* Product Panel */}
      <div className="flex-1 flex flex-col border-r">
        <div className="p-4 border-b bg-white flex gap-3 items-center">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.kode} value={c.kode}>{c.nama}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
{products.map(p => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  disabled={p.status !== 'aktif' || p.stok <= 0}
                  className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-gray-50 relative overflow-hidden rounded-lg mb-3">
                    {p.image_url ? (
                      <img src={`/uploads${p.image_url.replace('/uploads', '')}`}
                        alt={p.nama}
                        className="w-full h-full object-cover absolute inset-0" />
                    ) : null}
                    <span className={`${p.image_url ? 'hidden' : 'absolute inset-0 flex items-center justify-center text-3xl'}`}>📦</span>
                  </div>
                <p className="font-medium text-sm text-gray-900 truncate">{p.nama}</p>
                <p className="text-xs text-gray-500">{p.kategori}</p>
                <p className="text-sm font-bold text-blue-600 mt-1">
                  Rp {p.harga_jual.toLocaleString('id-ID')}
                </p>
                <p className={`text-xs ${p.stok <= p.stok_minimum ? 'text-red-500' : 'text-gray-400'}`}>
                  Stok: {p.stok}
                </p>
              </button>
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                {search ? 'Produk tidak ditemukan' : 'Belum ada produk'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-96 bg-white flex flex-col">
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h2 className="text-lg font-bold">🛒 Kasir</h2>
          <p className="text-sm text-blue-100">{cart.length} item dalam keranjang</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map(c => (
            <div key={c.product.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-sm text-gray-900 truncate flex-1">{c.product.nama}</p>
                <button onClick={() => removeFromCart(c.product.id)} className="text-red-400 hover:text-red-600 ml-2">&times;</button>
              </div>
              <p className="text-xs text-gray-500 mb-2">Rp {c.product.harga_jual.toLocaleString('id-ID')} x {c.quantity}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(c.product.id, -1)} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-bold">-</button>
                  <span className="w-8 text-center font-bold">{c.quantity}</span>
                  <button onClick={() => updateQuantity(c.product.id, 1)} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-bold">+</button>
                </div>
                <p className="font-bold text-sm text-blue-600">Rp {(c.product.harga_jual * c.quantity).toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🛒</p>
              <p className="text-sm">Keranjang masih kosong</p>
              <p className="text-xs">Klik produk untuk menambahkan</p>
            </div>
          )}
        </div>

        <div className="border-t p-4 space-y-3 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Item</span>
            <span className="font-bold">{cart.reduce((s, c) => s + c.quantity, 0)}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-blue-600">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <select
            value={paymentType}
            onChange={e => setPaymentType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="cash">Tunai</option>
            <option value="transfer">Transfer</option>
            <option value="credit">Kredit</option>
          </select>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Bayar'}
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowReceipt(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Pembayaran Berhasil</h3>
              <p className="text-sm text-gray-500">{lastTransaction.nomor}</p>
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              {lastTransaction.items.map(c => (
                <div key={c.product.id} className="flex justify-between">
                  <span>{c.product.nama} x{c.quantity}</span>
                  <span className="font-medium">Rp {(c.product.harga_jual * c.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-600">Rp {lastTransaction.total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={printReceipt} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cetak Struk</button>
              <button onClick={() => setShowReceipt(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
