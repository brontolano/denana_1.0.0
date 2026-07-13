import { useState, useEffect, useCallback } from 'react'
import { publicApi } from '../services/api'
import type { Product } from '../types'

interface LandingPageProps {
  onNavigate: (page: 'login' | 'register' | 'app') => void
}

interface CartItem {
  product: Product
  quantity: number
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
        {product.image_url ? (
          <img src={`/uploads${product.image_url.replace('/uploads', '')}`} alt={product.nama}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-30 group-hover:opacity-50 transition-opacity">📦</div>
        )}
        {product.stok <= product.stok_minimum && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-semibold rounded-full">Stok Terbatas</span>
        )}
      </div>
      <div className="p-4">
        <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{product.kategori}</span>
        <h3 className="font-semibold text-gray-900 mt-2 text-sm leading-snug line-clamp-2">{product.nama}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-lg font-bold text-gray-900">Rp</span>
          <span className="text-xl font-bold text-gray-900">{product.harga_jual.toLocaleString('id-ID')}</span>
        </div>
        <button
          onClick={() => onAdd(product)}
          disabled={product.stok <= 0}
          className="w-full mt-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {product.stok <= 0 ? 'Stok Habis' : '+ Keranjang'}
        </button>
      </div>
    </div>
  )
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [checkoutForm, setCheckoutForm] = useState({ customer_name: '', customer_phone: '', customer_address: '', notes: '' })

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 2500); return () => clearTimeout(t) }
  }, [toast])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type })

  const loadProducts = useCallback(async () => {
    try {
      const data = await publicApi.getProducts({
        page_size: 50, kategori: selectedCategory || undefined, q: search || undefined
      })
      setProducts(data.items || [])
      const cats = [...new Set((data.items || []).map(p => p.kategori))]
      setCategories(cats.filter(Boolean))
    } catch { setProducts([]) }
  }, [selectedCategory, search])

  useEffect(() => { loadProducts() }, [loadProducts])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(c => c.product.id === product.id)
      if (existing) return prev.map(c => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { product, quantity: 1 }]
    })
    showToast(`${product.nama} ditambahkan ke keranjang`)
  }

  const removeFromCart = (productId: number) => setCart(prev => prev.filter(c => c.product.id !== productId))
  const updateQty = (productId: number, delta: number) => setCart(prev => prev.map(c => {
    if (c.product.id !== productId) return c
    const nq = c.quantity + delta
    return nq <= 0 ? null : { ...c, quantity: nq }
  }).filter(Boolean) as CartItem[])

  const cartTotal = cart.reduce((s, c) => s + c.product.harga_jual * c.quantity, 0)
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)

  const handleCheckout = async () => {
    if (cart.length === 0 || !checkoutForm.customer_name || !checkoutForm.customer_phone) return
    try {
      for (const item of cart) {
        await publicApi.createOrder({
          product_id: item.product.id, jumlah: item.quantity,
          harga_satuan: item.product.harga_jual,
          customer_name: checkoutForm.customer_name, customer_phone: checkoutForm.customer_phone,
          customer_address: checkoutForm.customer_address || undefined, notes: checkoutForm.notes || undefined
        })
      }
      setOrderSuccess(true); setCart([]); setShowCheckout(false)
      setCheckoutForm({ customer_name: '', customer_phone: '', customer_address: '', notes: '' })
    } catch { showToast('Gagal memproses pesanan', 'error') }
  }

  return (
    <div className="min-h-screen bg-white">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 animate-slide-down ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>{toast.msg}</div>
      )}

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-sm">D</div>
            <span className="font-bold text-xl text-gray-900">Den Ana</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCart(!showCart)} className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm animate-scale-in">{cartCount}</span>}
            </button>
            <button onClick={() => onNavigate('login')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Masuk</button>
            <button onClick={() => onNavigate('register')} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-md transition-all">Daftar</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50/30" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-4">Katalog Produk</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Belanja Kebutuhan{' '}
            <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-orange-500 bg-clip-text text-transparent">Lebih Mudah</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">Temukan berbagai produk kebutuhan Anda. Pesan sekarang.</p>
          <div className="max-w-lg mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === '' ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Semua</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all capitalize ${selectedCategory === cat ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {products.map(product => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}
          </div>
          {products.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-4xl">🔍</span></div>
              <p className="text-gray-900 font-semibold">Produk tidak ditemukan</p>
              <p className="text-gray-400 text-sm mt-1">Coba kata kunci lain</p>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-gray-50/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">&copy; 2026 Den Ana. All rights reserved.</div>
      </footer>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50" onClick={() => setShowCart(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl animate-slide-left" onClick={e => e.stopPropagation()}>
            <div className="h-full flex flex-col">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-lg text-gray-900">Keranjang {cartCount > 0 && <span className="text-blue-600">({cartCount})</span>}</h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                      {item.product.image_url ? (
                        <img src={`/uploads${item.product.image_url.replace('/uploads', '')}`} alt={item.product.nama} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{item.product.nama}</p>
                      <p className="text-sm font-bold text-blue-600 mt-0.5">Rp {item.product.harga_jual.toLocaleString('id-ID')}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQty(item.product.id, -1)} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold hover:bg-gray-50">-</button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.product.id, 1)} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold hover:bg-gray-50">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="p-2 hover:bg-white rounded-xl transition-colors">
                      <svg className="w-4 h-4 text-red-300 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
                {cart.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3"><span className="text-3xl">🛒</span></div>
                    <p className="text-gray-500 font-medium">Keranjang kosong</p>
                    <p className="text-gray-400 text-sm mt-1">Tambahkan produk dari katalog</p>
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-100 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Total</span>
                    <span className="text-xl font-bold text-gray-900">Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <button onClick={() => { setShowCheckout(true); setShowCart(false) }}
                    className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl font-semibold hover:shadow-lg active:scale-[0.98] transition-all duration-200">Lanjut ke Checkout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowCheckout(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Data Pembeli</h3>
            <p className="text-sm text-gray-400 mb-5">Isi data diri untuk pemrosesan pesanan</p>
            <div className="space-y-3.5">
              <input type="text" placeholder="Nama Lengkap *" value={checkoutForm.customer_name} onChange={e => setCheckoutForm({ ...checkoutForm, customer_name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
              <input type="tel" placeholder="No. WhatsApp *" value={checkoutForm.customer_phone} onChange={e => setCheckoutForm({ ...checkoutForm, customer_phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" />
              <textarea placeholder="Alamat (opsional)" value={checkoutForm.customer_address} onChange={e => setCheckoutForm({ ...checkoutForm, customer_address: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" rows={2} />
              <textarea placeholder="Catatan (opsional)" value={checkoutForm.notes} onChange={e => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" rows={2} />
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between">
                    <span className="text-gray-600">{item.product.nama} <span className="text-gray-400">x{item.quantity}</span></span>
                    <span className="font-medium">Rp {(item.product.harga_jual * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-blue-600">Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={!checkoutForm.customer_name || !checkoutForm.customer_phone}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-semibold hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">Pesan Sekarang</button>
              <button onClick={() => setShowCheckout(false)} className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors text-center">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setOrderSuccess(false)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm mx-4 text-center shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h3>
            <p className="text-sm text-gray-400 mb-6">Tim kami akan menghubungi Anda melalui WhatsApp.</p>
            <button onClick={() => setOrderSuccess(false)} className="w-full py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-200">Tutup</button>
          </div>
        </div>
      )}
    </div>
  )
}
