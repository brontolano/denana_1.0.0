import { useState, useEffect } from 'react'
import { productApi, transactionApi, authApi, kategoriApi } from '../services/api'
import { useAuthStore } from '../store/authStore'

export function AdminPanelPage() {
  const { user: currentUser } = useAuthStore()
  const [stats, setStats] = useState({
    products: 0, transactions: 0, users: 0, kategoris: 0, lowStock: 0, revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [p, t, u, k, l] = await Promise.all([
        productApi.getProducts({ page_size: 1 }),
        transactionApi.getTransactions({ page_size: 1 }),
        authApi.getUsers({ page_size: 1 }),
        kategoriApi.getKategoris({ page_size: 1 }),
        productApi.getProducts({ page_size: 1, stok_below: 5 }),
      ])
      setStats({
        products: p.total, transactions: t.total, users: u.total,
        kategoris: k.total, lowStock: l.total, revenue: 0
      })
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  const cards = [
    { label: 'Total Produk', value: stats.products, icon: '📦', color: 'from-blue-500 to-blue-600' },
    { label: 'Transaksi', value: stats.transactions, icon: '💳', color: 'from-green-500 to-green-600' },
    { label: 'Pengguna', value: stats.users, icon: '👥', color: 'from-purple-500 to-purple-600' },
    { label: 'Kategori', value: stats.kategoris, icon: '🏷️', color: 'from-orange-500 to-orange-600' },
    { label: 'Stok Menipis', value: stats.lowStock, icon: '⚠️', color: 'from-red-500 to-red-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Panel Admin</h2>
        <p className="text-gray-500 text-sm mt-1">Selamat datang, {currentUser?.full_name || 'Admin'}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} p-5 text-white shadow-lg`}>
            <div className="absolute top-3 right-3 text-3xl opacity-20">{card.icon}</div>
            <p className="text-sm font-medium text-white/80">{card.label}</p>
            <p className="text-3xl font-bold mt-1">{loading ? '-' : card.value.toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm">⚡</span>
            Aksi Cepat
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📦', label: 'Tambah Produk', desc: 'Buat produk baru', page: 'products' as const },
              { icon: '💳', label: 'Buat Transaksi', desc: 'Transaksi manual', page: 'transactions' as const },
              { icon: '🏷️', label: 'Kelola Kategori', desc: 'Atur kategori produk', page: 'kategoris' as const },
              { icon: '👥', label: 'Kelola User', desc: 'Atur pengguna', page: 'users' as const },
            ].map(action => (
              <div key={action.label}
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-admin', { detail: action.page }))}
                className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-100 border border-gray-100 cursor-pointer transition-all group">
                <span className="text-2xl">{action.icon}</span>
                <p className="font-semibold text-sm text-gray-900 mt-2 group-hover:text-blue-600 transition-colors">{action.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{action.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-sm">⚙️</span>
            Informasi Sistem
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Status', value: '🟢 Online', color: 'text-green-600' },
              { label: 'Database', value: 'SQLite', color: 'text-gray-900' },
              { label: 'Backend', value: 'FastAPI', color: 'text-gray-900' },
              { label: 'Frontend', value: 'React + Vite', color: 'text-gray-900' },
              { label: 'Waktu', value: new Date().toLocaleString('id-ID'), color: 'text-gray-500' },
            ].map(info => (
              <div key={info.label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{info.label}</span>
                <span className={`text-sm font-medium ${info.color}`}>{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
