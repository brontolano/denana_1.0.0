interface BluetoothDevice {
  gatt: {
    connect: () => Promise<{
      getPrimaryService: (service: string) => Promise<{
        getCharacteristic: (characteristic: string) => Promise<{
          writeValue: (data: Uint8Array) => Promise<void>
        }>
      }>
    }>
  }
}

export interface PrintJob {
  content: string
  printerName?: string
}

export class PrintService {
  static async checkBluetoothSupport(): Promise<boolean> {
    return 'bluetooth' in navigator
  }

  static async requestBluetoothDevice(): Promise<BluetoothDevice | null> {
    if (!('bluetooth' in navigator)) {
      alert('Browser tidak mendukung Web Bluetooth API')
      return null
    }

    try {
      const device = await (navigator as unknown as { bluetooth: { requestDevice: (opts: Record<string, unknown>) => Promise<unknown> } }).bluetooth.requestDevice({
        filters: [
          { services: ['printer'] },
          { namePrefix: 'Thermal' },
          { namePrefix: 'Printer' },
        ],
        optionalServices: ['printer']
      })
      return device as unknown as BluetoothDevice
    } catch (err) {
      console.error('Bluetooth request failed:', err)
      return null
    }
  }

  static async printToPrinter(device: BluetoothDevice, content: string): Promise<void> {
    try {
      const server = await device.gatt.connect()
      const service = await server.getPrimaryService('printer')
      const characteristic = await service.getCharacteristic('printer')
      await characteristic.writeValue(new TextEncoder().encode(content))
    } catch (err) {
      console.error('Print failed:', err)
      throw new Error('Gagal mencetak ke printer')
    }
  }

  static formatReceipt(data: {
    items: { name: string; quantity: number; price: number; total: number }[]
    subtotal: number
    paymentType?: string
    cashReceived?: number
    change?: number
    transactionNumber: string
    date: string
    storeName: string
  }): string {
    const { items, subtotal, paymentType, cashReceived, change, transactionNumber, date, storeName } = data
    
    let receipt = ''
    receipt += '============================\n'
    receipt += `   ${storeName}\n`
    receipt += '   Struk Pembayaran\n'
    receipt += '============================\n'
    receipt += `No: ${transactionNumber}\n`
    receipt += `Tgl: ${date}\n`
    receipt += '----------------------------\n'
    
    items.forEach(item => {
      receipt += `${item.name} x${item.quantity}\n`
      receipt += `  Rp ${item.total.toLocaleString('id-ID')}\n`
    })
    
    receipt += '----------------------------\n'
    receipt += `Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n`
    
    if (paymentType) {
      receipt += `Pembayaran: ${paymentType}\n`
    }
    if (cashReceived !== undefined) {
      receipt += `Tunai: Rp ${cashReceived.toLocaleString('id-ID')}\n`
    }
    if (change !== undefined) {
      receipt += `Kembalian: Rp ${change.toLocaleString('id-ID')}\n`
    }
    
    receipt += '============================\n'
    receipt += '  Terima kasih atas pembelian!\n'
    receipt += '============================\n'
    
    return receipt
  }

  static printReceipt(content: string): void {
    try {
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Pop-up blocker mencegah pencetakan. Silakan nonaktifkan blocker.')
        return
      }

      const style = `
        <style>
          body { font-family: 'Courier New', monospace; padding: 20px; }
          @media print {
            body { padding: 0; }
            @page { margin: 0; size: auto; }
          }
        </style>
      `
      const formattedContent = content.replace(/\n/g, '<br>')

      printWindow.document.write(`<!DOCTYPE html><html><head>${style}</head><body>${formattedContent}</body></html>`)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
        setTimeout(() => printWindow.close(), 1000)
      }
    } catch (err) {
      console.error('Print error:', err)
      alert('Gagal mencetak struk')
    }
  }
}
