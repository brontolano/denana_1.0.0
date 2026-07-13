import { useState, useEffect } from 'react'
import { dashboardApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { DashboardSkeleton } from '../components/LoadingSkeleton'

interface DashboardStats {
  totalProducts: number
  totalTransactions: number
  totalUsers: number
  totalRevenue: number
  lowStockProducts: number
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalTransactions: 0,
    totalUsers: 0,
    totalRevenue: 0,
    lowStockProducts: 0
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await dashboardApi.getStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-gray-500 mt-2">
          Selamat datang kembali, <span className="font-semibold text-blue-600">{user?.full_name || user?.username || 'Staff'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Produk', value: stats.totalProducts, icon: '📦', bg: 'bg-blue-500', shadow: 'shadow-blue-200' },
            { label: 'Total Transaksi', value: stats.totalTransactions, icon: '💳', bg: 'bg-green-500', shadow: 'shadow-green-200' },
            { label: 'Total Pengguna', value: stats.totalUsers, icon: '👥', bg: 'bg-purple-500', shadow: 'shadow-purple-200' },
            { label: 'Stok Menipis', value: stats.lowStockProducts, icon: '⚠️', bg: 'bg-orange-500', shadow: 'shadow-orange-200' },
          ].map((item, index) => (
            <div key={index} className={`${item.bg} rounded-2xl p-6 text-white shadow-lg ${item.shadow} transition-transform hover:scale-105`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{item.label}</p>
                <p className="text-4xl font-bold mt-2">{item.value}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-2xl">{item.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-xl">📊</span> Ringkasan Stok
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition">
              <span className="text-gray-700 font-medium">Produk Aktif</span>
              <span className="font-bold text-gray-900 text-lg">{stats.totalProducts}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
              <span className="text-red-700 font-medium">Produk Stok Menipis</span>
              <span className="font-bold text-red-600 text-lg">{stats.lowStockProducts}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-xl">⚙️</span> Status Sistem
          </h3>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-green-800 font-medium">Sistem berjalan normal (Uptime: 99.9%)</p>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            Pembaruan terakhir: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  )
}
