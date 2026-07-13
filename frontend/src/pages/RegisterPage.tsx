import { useState } from 'react'
import { authApi } from '../services/api'
import { useAuthStore } from '../store/authStore'

interface RegisterPageProps {
  onNavigate: (page: 'login' | 'register' | 'app') => void
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const register = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authApi.register({ username, email, full_name: fullName, password, role })
      const login = await authApi.login(username, password)
      register(response, login.access_token)
      onNavigate('app')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      const detail = axiosErr?.response?.data?.detail
      let msg = 'Pendaftaran gagal'
      if (detail) {
        if (typeof detail === 'string') {
          msg = detail
        } else if (Array.isArray(detail)) {
          msg = (detail as { msg?: string }[]).map((e: { msg?: string }) => e?.msg || '').join(', ')
        }
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Daftar Akun
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Buat akun baru untuk Den Ana
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Peran</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sudah punya akun? Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
