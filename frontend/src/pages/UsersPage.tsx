import { useState, useEffect } from 'react'
import { authApi } from '../services/api'
import type { User } from '../types'

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'staff' as 'admin' | 'manager' | 'staff',
    is_active: true
  })

  useEffect(() => {
    fetchUsers()
  }, [page, searchQuery, filterRole])

  const fetchUsers = async () => {
    try {
      const params: Record<string, unknown> = { page, page_size: 20 }
      if (searchQuery) params.q = searchQuery
      if (filterRole) params.role = filterRole
      
      const data = await authApi.getUsers(params)
      setUsers(data.items)
      setTotalPages(data.total_pages)
    } catch { 
      console.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email || '',
      full_name: user.full_name || '',
      password: '',
      role: user.role || 'staff',
      is_active: user.is_active ?? true
    })
    setShowEditModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus user ini?')) return
    
    try {
      await authApi.deleteUser(id)
      fetchUsers()
    } catch {
      alert('Gagal menghapus user')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    
    try {
      const data: Record<string, unknown> = {
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role,
        is_active: formData.is_active
      }
      
      if (formData.password) {
        data.password = formData.password
      }
      
      await authApi.updateUser(editingUser.id!, data)
      setShowEditModal(false)
      fetchUsers()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      alert(axiosErr?.response?.data?.detail || 'Gagal memperbarui user')
    }
  }

  if (loading) return <div className="p-4">Memuat...</div>

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Pengguna</h2>
        
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Peran</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peran</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.email || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{user.full_name || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role || 'staff'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id!)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Tidak ada pengguna
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 mt-4">
          <div className="text-sm text-gray-700">
            Halaman {page} dari {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Edit User: {editingUser.username}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password (kosongkan jika tidak diubah)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'manager' | 'staff'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({...formData, is_active: e.target.value === 'active'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
