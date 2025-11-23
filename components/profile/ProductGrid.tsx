import ProductGridItem from './ProductGridItem'

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  likes?: any[]
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full border-4 border-black mb-4 flex items-center justify-center">
          <span className="text-3xl">📦</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Posts Yet</h3>
        <p className="text-gray-500 text-sm mb-6">Start selling to see your products here</p>
        <a
          href="/sell"
          className="bg-black text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Create Your First Post
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-2 mt-4">
      {products.map((product) => (
        <ProductGridItem key={product.id} product={product} />
      ))}
    </div>
  )
}
