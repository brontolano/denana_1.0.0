import type { Product, Transaction, User } from '../types'

interface ReportOptions {
  title: string
  subtitle?: string
  dateFrom?: string
  dateTo?: string
}

export class ReportService {
  static generateProductReport(
    products: Product[],
    options?: ReportOptions
  ): HTMLDocument {
    const doc = document.implementation.createHTMLDocument('Product Report')
    const style = doc.createElement('style')
    style.textContent = `
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
      h2 { color: #374151; margin-top: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
      th { background-color: #f3f4f6; font-weight: 600; }
      .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
      .alert { color: #dc2626; font-weight: bold; }
    `
    doc.head.appendChild(style)

    const header = doc.createElement('div')
    header.innerHTML = `
      <h1>${options?.title || 'Laporan Produk'}</h1>
      ${options?.subtitle ? `<p style="color:#6b7280;">${options.subtitle}</p>` : ''}
      ${options?.dateFrom && options?.dateTo 
        ? `<p style="color:#6b7280;">Periode: ${options.dateFrom} s/d ${options.dateTo}</p>` 
        : ''}
    `
    doc.body.appendChild(header)

    if (products.length === 0) {
      doc.body.innerHTML += '<p>Tidak ada produk yang ditemukan.</p>'
    } else {
      const table = doc.createElement('table')
      table.innerHTML = `
        <thead>
          <tr>
            <th>Kode</th>
            <th>Nama</th>
            <th>Kategori</th>
            <th>Harga Beli</th>
            <th>Harga Jual</th>
            <th>Stok</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td>${p.kode}</td>
              <td>${p.nama}</td>
              <td>${p.kategori}</td>
              <td>Rp ${p.harga_beli.toLocaleString('id-ID')}</td>
              <td>Rp ${p.harga_jual.toLocaleString('id-ID')}</td>
              <td class="${p.stok <= p.stok_minimum ? 'alert' : ''}">${p.stok}</td>
              <td>${p.status}</td>
            </tr>
          `).join('')}
        </tbody>
      `
      doc.body.appendChild(table)
    }

    doc.body.innerHTML += `
      <div class="footer">
        <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
        <p>Den Ana Internal System - v1.0.0</p>
      </div>
    `

    return doc
  }

  static generateTransactionReport(
    transactions: Transaction[],
    options?: ReportOptions
  ): HTMLDocument {
    const doc = document.implementation.createHTMLDocument('Transaction Report')
    const style = doc.createElement('style')
    style.textContent = `
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
      h2 { color: #374151; margin-top: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
      th { background-color: #f3f4f6; font-weight: 600; }
      .total { font-weight: bold; color: #1e40af; }
      .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
      .type-penjualan { color: #16a34a; }
      .type-pembelian { color: #3b82f6; }
      .type-return { color: #ea580c; }
    `
    doc.head.appendChild(style)

    const header = doc.createElement('div')
    header.innerHTML = `
      <h1>${options?.title || 'Laporan Transaksi'}</h1>
      ${options?.subtitle ? `<p style="color:#6b7280;">${options.subtitle}</p>` : ''}
      ${options?.dateFrom && options?.dateTo 
        ? `<p style="color:#6b7280;">Periode: ${options.dateFrom} s/d ${options.dateTo}</p>` 
        : ''}
    `
    doc.body.appendChild(header)

    if (transactions.length === 0) {
      doc.body.innerHTML += '<p>Tidak ada transaksi yang ditemukan.</p>'
    } else {
      const table = doc.createElement('table')
      table.innerHTML = `
        <thead>
          <tr>
            <th>Nomor</th>
            <th>Tipe</th>
            <th>Produk</th>
            <th>Jumlah</th>
            <th>Harga Satuan</th>
            <th>Total</th>
            <th>Status</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(t => `
            <tr>
              <td>${t.nomor}</td>
              <td class="type-${t.tipe}">${t.tipe.toUpperCase()}</td>
              <td>${t.product?.nama || '-'}</td>
              <td>${t.jumlah}</td>
              <td>Rp ${t.harga_satuan.toLocaleString('id-ID')}</td>
              <td class="total">Rp ${t.total_harga.toLocaleString('id-ID')}</td>
              <td>${t.status}</td>
              <td>${t.tanggal_transaksi ? new Date(t.tanggal_transaksi).toLocaleDateString('id-ID') : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      `
      doc.body.appendChild(table)
    }

    doc.body.innerHTML += `
      <div class="footer">
        <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
        <p>Den Ana Internal System - v1.0.0</p>
      </div>
    `

    return doc
  }

  static generateUserReport(
    users: User[],
    options?: ReportOptions
  ): HTMLDocument {
    const doc = document.implementation.createHTMLDocument('User Report')
    const style = doc.createElement('style')
    style.textContent = `
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
      h2 { color: #374151; margin-top: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
      th { background-color: #f3f4f6; font-weight: 600; }
      .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
      .role-admin { color: #9333ea; }
      .role-manager { color: #3b82f6; }
      .role-staff { color: #6b7280; }
    `
    doc.head.appendChild(style)

    const header = doc.createElement('div')
    header.innerHTML = `
      <h1>${options?.title || 'Laporan Pengguna'}</h1>
      ${options?.subtitle ? `<p style="color:#6b7280;">${options.subtitle}</p>` : ''}
      ${options?.dateFrom && options?.dateTo 
        ? `<p style="color:#6b7280;">Periode: ${options.dateFrom} s/d ${options.dateTo}</p>` 
        : ''}
    `
    doc.body.appendChild(header)

    if (users.length === 0) {
      doc.body.innerHTML += '<p>Tidak ada pengguna yang ditemukan.</p>'
    } else {
      const table = doc.createElement('table')
      table.innerHTML = `
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Nama</th>
            <th>Peran</th>
            <th>Status</th>
            <th>Dibuat</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td>${u.username}</td>
              <td>${u.email || '-'}</td>
              <td>${u.full_name || '-'}</td>
              <td class="role-${u.role || 'staff'}">${u.role || 'staff'}</td>
              <td>${u.is_active ? 'Aktif' : 'Tidak Aktif'}</td>
              <td>${u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      `
      doc.body.appendChild(table)
    }

    doc.body.innerHTML += `
      <div class="footer">
        <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
        <p>Den Ana Internal System - v1.0.0</p>
      </div>
    `

    return doc
  }

  static printReport(doc: HTMLDocument) {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Pop-up blocker mencegah pencetakan. Silakan nonaktifkan blocker.')
      return
    }

    printWindow.document.write(doc.documentElement.outerHTML)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
      setTimeout(() => printWindow.close(), 1000)
    }
  }
}
