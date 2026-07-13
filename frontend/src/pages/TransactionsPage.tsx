import { useState, useEffect } from 'react'
import { transactionApi, productApi } from '../services/api'
import { PrintService } from '../services/printService'
import { useAuthStore } from '../store/authStore'
import type { Transaction, Product } from '../types'

export function TransactionsPage() {
  const { user: currentUser } = useAuthStore()
  const isAdmin = currentUser?.role === 'admin'
  
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [formData, setFormData] = useState({
    tipe: 'penjualan' as 'penjualan' | 'pembelian' | 'return',
    product_id: 0,
    jumlah: 1,
    harga_satuan: 0,
    jenis_pembayaran: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [statusForm, setStatusForm] = useState({ status: 'completed' })

  useEffect(() => {
    fetchData()
    fetchProducts()
  }, [page])

  const fetchData = async () => {
    try {
      const data = await transactionApi.getTransactions({ page, page_size: 20 })
      setTransactions(data.items)
      setTotalPages(data.total_pages)
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const data = await productApi.getProducts({ page_size: 100 })
      setProducts(data.items)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.product_id) newErrors.product_id = 'Produk harus dipilih'
    if (!formData.jumlah || formData.jumlah < 1) newErrors.jumlah = 'Jumlah harus minimal 1'
    if (!formData.harga_satuan || formData.harga_satuan < 0) newErrors.harga_satuan = 'Harga satuan harus valid'
    
    if (formData.tipe === 'penjualan') {
      const product = products.find(p => p.id === formData.product_id)
      if (product && product.stok < formData.jumlah) {
        newErrors.jumlah = 'Stok tidak mencukupi'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    try {
      await transactionApi.createTransaction(formData)
      setShowCreateModal(false)
      setFormData({
        tipe: 'penjualan',
        product_id: 0,
        jumlah: 1,
        harga_satuan: 0,
        jenis_pembayaran: ''
      })
      fetchData()
    } catch (err) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      alert(axiosErr?.response?.data?.detail || 'Gagal membuat transaksi')
    }
  }

  const printReceipt = (transaction: Transaction) => {
    const product = transaction.product
    const receiptContent = PrintService.formatReceipt({
      transactionNumber: transaction.nomor,
      date: transaction.created_at ? new Date(transaction.created_at).toLocaleString('id-ID') : '-',
      storeName: 'Den Ana',
      items: [{
        name: product?.nama || '-',
        quantity: transaction.jumlah,
        price: transaction.harga_satuan,
        total: transaction.total_harga
      }],
      subtotal: transaction.total_harga,
      paymentType: transaction.jenis_pembayaran || 'N/A',
    })
    PrintService.printReceipt(receiptContent)
  }

  const handleStatusUpdate = async (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setStatusForm({ status: transaction.status })
    setShowStatusModal(true)
  }

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTransaction) return

    try {
      await transactionApi.updateTransaction(editingTransaction.id, statusForm)
      setShowStatusModal(false)
      fetchData()
    } catch (err) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      alert(axiosErr?.response?.data?.detail || 'Gagal memperbarui status')
    }
  }

  const handleDelete = async (transaction: Transaction) => {
    if (!confirm(`Hapus transaksi ${transaction.nomor}? Stok akan dikembalikan.`)) return

    try {
      await transactionApi.deleteTransaction(transaction.id)
      fetchData()
    } catch (err) {
      const axiosErr = err as { response?: { data?: { detail?: string } } }
      alert(axiosErr?.response?.data?.detail || 'Gagal menghapus transaksi')
    }
  }

  if (loading) return <div className="p-4">Memuat...</div>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transaksi</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Buat Transaksi
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nomor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Satuan</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Harga</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{transaction.nomor}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.tipe === 'penjualan' ? 'bg-green-100 text-green-800' :
                      transaction.tipe === 'pembelian' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {transaction.tipe}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{transaction.product?.nama || '-'}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500">{transaction.jumlah}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-500">{transaction.harga_satuan.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">{transaction.total_harga.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-500">
                    {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => printReceipt(transaction)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        Cetak
                      </button>
                      {isAdmin && <>
                        <button
                          onClick={() => handleStatusUpdate(transaction)}
                          className="px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded"
                        >
                          Status
                        </button>
                        <button
                          onClick={() => handleDelete(transaction)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          Hapus
                        </button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Belum ada transaksi
          </div>
        )}
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Buat Transaksi Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produk</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({...formData, product_id: parseInt(e.target.value)})}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.product_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value={0}>Pilih Produk</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.nama} (Stok: {product.stok})</option>
                  ))}
                </select>
                {errors.product_id && <p className="text-red-500 text-sm mt-1">{errors.product_id}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Transaksi</label>
                <select
                  value={formData.tipe}
                  onChange={(e) => setFormData({...formData, tipe: e.target.value as 'penjualan' | 'pembelian' | 'return'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="penjualan">Penjualan</option>
                  <option value="pembelian">Pembelian</option>
                  <option value="return">Return</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                <input
                  type="number"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({...formData, jumlah: parseInt(e.target.value) || 0})}
                  min={1}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.jumlah ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.jumlah && <p className="text-red-500 text-sm mt-1">{errors.jumlah}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Satuan</label>
                <input
                  type="number"
                  value={formData.harga_satuan}
                  onChange={(e) => setFormData({...formData, harga_satuan: parseFloat(e.target.value) || 0})}
                  min={0}
                  step={0.01}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.harga_satuan ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.harga_satuan && <p className="text-red-500 text-sm mt-1">{errors.harga_satuan}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pembayaran (opsional)</label>
                <select
                  value={formData.jenis_pembayaran}
                  onChange={(e) => setFormData({...formData, jenis_pembayaran: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih...</option>
                  <option value="cash">Tunai</option>
                  <option value="credit">Kredit</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Buat Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdmin && showStatusModal && editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Update Status: {editingTransaction.nomor}</h3>
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({...statusForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowStatusModal(false); setEditingTransaction(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
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