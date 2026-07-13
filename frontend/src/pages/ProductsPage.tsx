import { ProductList } from '../components/ProductList'

export function ProductsPage() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Daftar Produk</h2>
      <ProductList />
    </div>
  )
}