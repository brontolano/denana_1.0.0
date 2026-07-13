import type { ReactNode } from 'react'
import { useAuthStore } from '../../store/authStore'

type AppPage = 'dashboard' | 'pos' | 'products' | 'transactions' | 'users' | 'admin' | 'kategoris'

interface LayoutProps {
  children: ReactNode
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { logout, user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  const navItems = [
    { label: 'Dashboard', icon: '📊', page: 'dashboard' as const, show: true },
    { label: 'POS Kasir', icon: '🧾', page: 'pos' as const, show: true },
    { label: 'Produk', icon: '📦', page: 'products' as const, show: true },
    { label: 'Transaksi', icon: '💳', page: 'transactions' as const, show: true },
    { label: 'Kategori', icon: '🏷️', page: 'kategoris' as const, show: true },
    { label: 'Pengguna', icon: '👥', page: 'users' as const, show: isAdmin },
    { label: 'Admin Panel', icon: '⚙️', page: 'admin' as const, show: isAdmin },
  ].filter(item => item.show)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen top-0 left-0 z-40 flex flex-col transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100 bg-white">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm">D</div>
          <span className="font-bold text-lg text-gray-900">Den Ana</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPage === item.page
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name || 'User'}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role || 'staff'}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 hover:text-red-600 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}