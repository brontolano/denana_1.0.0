import { useState, useEffect } from 'react'
import { productApi, kategoriApi } from '../services/api'
import type { Product, ProductFormData } from '../types'

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    kode: '',
    nama: '',
    kategori: 'lainnya',
    harga_beli: 0,
    harga_jual: 0,
    stok: 0,
    stok_minimum: 5,
    satuan: 'pcs',
    image_base64: undefined,
    deskripsi: '',
    status: 'aktif'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [kategoris, setKategoris] = useState<{ kode: string; nama: string }[]>([])

  useEffect(() => {
    fetchProducts()
  }, [page])

  useEffect(() => {
    kategoriApi.getKategoris({ page_size: 100 }).then(d => setKategoris(d.items || [])).catch(() => {})
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await productApi.getProducts({ page, page_size: 20 })
      setProducts(data.items)
      setTotalPages(data.total_pages)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.kode) newErrors.kode = 'Kode produk wajib diisi'
    if (!formData.nama) newErrors.nama = 'Nama produk wajib diisi'
    if (formData.harga_beli < 0) newErrors.harga_beli = 'Harga beli tidak boleh negatif'
    if (formData.harga_jual < 0) newErrors.harga_jual = 'Harga jual tidak boleh negatif'
    if (formData.stok < 0) newErrors.stok = 'Stok tidak boleh negatif'
    if (formData.stok_minimum < 0) newErrors.stok_minimum = 'Stok minimum tidak boleh negatif'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData({
      kode: '',
      nama: '',
      kategori: 'lainnya',
      harga_beli: 0,
      harga_jual: 0,
      stok: 0,
      stok_minimum: 5,
      satuan: 'pcs',
      image_base64: undefined,
      deskripsi: '',
      status: 'aktif'
    })
    setErrors({})
  }

  const handleCreate = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      kode: product.kode,
      nama: product.nama,
      kategori: product.kategori,
      harga_beli: product.harga_beli,
      harga_jual: product.harga_jual,
      stok: product.stok,
      stok_minimum: product.stok_minimum,
      satuan: product.satuan,
      image_base64: undefined,
      deskripsi: product.deskripsi || '',
      status: product.status
    })
    setShowEditModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus produk ini?')) return
    try {
      await productApi.deleteProduct(id)
      fetchProducts()
    } catch {
      alert('Gagal menghapus produk')
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      await productApi.createProduct(formData)
      setShowCreateModal(false)
      resetForm()
      fetchProducts()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      alert(axiosErr?.response?.data?.detail || 'Gagal membuat produk')
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!editingProduct) return
    try {
      await productApi.updateProduct(editingProduct.id, formData)
      setShowEditModal(false)
      setEditingProduct(null)
      resetForm()
      fetchProducts()
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      alert(axiosErr?.response?.data?.detail || 'Gagal memperbarui produk')
    }
  }

  if (loading) return <div className="p-4">Memuat...</div>

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Beli</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Jual</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stok</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {product.image_url ? (
                      <img src={`/uploads${product.image_url.replace('/uploads', '')}`} alt={product.nama} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xl">📦</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.kode}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{product.nama}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{product.kategori}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500">{product.harga_beli.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{product.harga_jual.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500">
                    <span className={product.stok <= product.stok_minimum ? 'text-red-600 font-bold' : ''}>
                      {product.stok}
                    </span>
                    {product.stok <= product.stok_minimum && (
                      <span className="ml-1 text-xs text-red-500" title="Stok menipis!">⚠️</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
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
      </div>

      {showCreateModal && (
        <ProductFormModal
          title="Tambah Produk Baru"
          formData={formData}
          errors={errors}
          kategoris={kategoris}
          onSubmit={handleCreateSubmit}
          onCancel={() => setShowCreateModal(false)}
          onChange={setFormData}
        />
      )}

      {showEditModal && editingProduct && (
        <ProductFormModal
          title={`Edit Produk: ${editingProduct.nama}`}
          formData={formData}
          errors={errors}
          kategoris={kategoris}
          onSubmit={handleEditSubmit}
          onCancel={() => setShowEditModal(false)}
          onChange={setFormData}
        />
      )}
    </div>
  )
}

interface ProductFormModalProps {
  title: string
  formData: ProductFormData
  errors: Record<string, string>
  kategoris: { kode: string; nama: string }[]
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  onChange: (data: ProductFormData) => void
}

function ProductFormModal({ title, formData, errors, kategoris: kats, onSubmit, onCancel, onChange }: ProductFormModalProps) {
  const katList = kats || []
  const updateField = (field: keyof ProductFormData, value: string | number) => {
    onChange({ ...formData, [field]: value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onChange({ ...formData, image_base64: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    onChange({ ...formData, image_base64: undefined })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode</label>
              <input
                type="text"
                value={formData.kode}
                onChange={(e) => updateField('kode', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.kode ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.kode && <p className="text-red-500 text-sm mt-1">{errors.kode}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => updateField('nama', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nama ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={formData.kategori}
                onChange={(e) => updateField('kategori', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {katList.map((k) => (
                  <option key={k.kode} value={k.kode}>{k.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
              <input
                type="text"
                value={formData.satuan}
                onChange={(e) => updateField('satuan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Beli</label>
              <input
                type="number"
                value={formData.harga_beli}
                onChange={(e) => updateField('harga_beli', parseFloat(e.target.value) || 0)}
                min={0}
                step={0.01}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.harga_beli ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.harga_beli && <p className="text-red-500 text-sm mt-1">{errors.harga_beli}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual</label>
              <input
                type="number"
                value={formData.harga_jual}
                onChange={(e) => updateField('harga_jual', parseFloat(e.target.value) || 0)}
                min={0}
                step={0.01}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.harga_jual ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.harga_jual && <p className="text-red-500 text-sm mt-1">{errors.harga_jual}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
              <input
                type="number"
                value={formData.stok}
                onChange={(e) => updateField('stok', parseInt(e.target.value) || 0)}
                min={0}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.stok ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.stok && <p className="text-red-500 text-sm mt-1">{errors.stok}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Minimum</label>
              <input
                type="number"
                value={formData.stok_minimum}
                onChange={(e) => updateField('stok_minimum', parseInt(e.target.value) || 0)}
                min={0}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.stok_minimum ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.stok_minimum && <p className="text-red-500 text-sm mt-1">{errors.stok_minimum}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>
            <div className="flex items-center gap-3">
              {formData.image_base64 ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                  <img src={formData.image_base64} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={removeImage} className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl-lg">&times;</button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">Tidak ada</div>
              )}
              <label className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                Pilih File
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => updateField('deskripsi', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="aktif">Aktif</option>
              <option value="tidak_aktif">Tidak Aktif</option>
              <option value="habis">Habis</option>
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
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
  )
}
