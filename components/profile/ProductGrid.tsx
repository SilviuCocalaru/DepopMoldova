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
  isDark?: boolean
}

export default function ProductGrid({ products, isDark = false }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className={`w-20 h-20 rounded-full border-4 mb-4 flex items-center justify-center ${
          isDark ? 'border-white' : 'border-black'
        }`}>
          <span className="text-3xl">📦</span>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>No Posts Yet</h3>
        <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Start selling to see your products here</p>
        <a
          href="/sell"
          className={`font-semibold px-6 py-2 rounded-lg transition-colors ${
            isDark 
              ? 'bg-white text-black hover:bg-gray-200' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
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
