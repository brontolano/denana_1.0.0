import { useState, useEffect } from 'react'
import { kategoriApi } from '../services/api'

interface Kategori {
  id: number
  kode: string
  nama: string
  deskripsi?: string | null
}

export function KategorisPage() {
  const [kategoris, setKategoris] = useState<Kategori[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingKategori, setEditingKategori] = useState<Kategori | null>(null)
  const [formData, setFormData] = useState({ kode: '', nama: '', deskripsi: '' })

  useEffect(() => {
    fetchKategoris()
  }, [page])

  const fetchKategoris = async () => {
    try {
      const data = await kategoriApi.getKategoris({ page, page_size: 20 })
      setKategoris(data.items || [])
      setTotalPages(data.total_pages || 1)
    } catch (err) {
      console.error('Failed to fetch kategoris:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ kode: '', nama: '', deskripsi: '' })
    setEditingKategori(null)
  }

  const handleCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (kategori: Kategori) => {
    setEditingKategori(kategori)
    setFormData({ kode: kategori.kode, nama: kategori.nama, deskripsi: kategori.deskripsi || '' })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus kategori ini?')) return
    try {
      await kategoriApi.deleteKategori(id)
      fetchKategoris()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      alert(axiosErr?.response?.data?.detail || 'Gagal menghapus kategori')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.kode || !formData.nama) {
      alert('Kode dan Nama harus diisi')
      return
    }
    try {
      if (editingKategori) {
        await kategoriApi.updateKategori(editingKategori.id, formData)
      } else {
        await kategoriApi.createKategori(formData)
      }
      setShowModal(false)
      resetForm()
      fetchKategoris()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      alert(axiosErr?.response?.data?.detail || 'Gagal menyimpan kategori')
    }
  }

  if (loading) return <div className="p-4">Memuat...</div>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kategori</h2>
        <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kategoris.map((kategori) => (
                <tr key={kategori.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{kategori.kode}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{kategori.nama}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{kategori.deskripsi || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleEdit(kategori)} className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(kategori.id)} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {kategoris.length === 0 && (
          <div className="p-8 text-center text-gray-500">Belum ada kategori</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="text-sm text-gray-700">Halaman {page} dari {totalPages}</div>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm border rounded disabled:opacity-50">
              Sebelumnya
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border rounded disabled:opacity-50">
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">{editingKategori ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode</label>
                <input type="text" value={formData.kode} onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contoh: elektronik" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contoh: Elektronik" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (opsional)</label>
                <textarea value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => { setShowModal(false); resetForm() }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Batal</button>
                <button type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
