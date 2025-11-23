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
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className={`w-16 h-16 rounded-full border-4 mb-2 flex items-center justify-center ${
          isDark ? 'border-white' : 'border-black'
        }`}>
          <span className="text-2xl">📦</span>
        </div>
        <h3 className={`text-base font-bold mb-1 ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>No Posts Yet</h3>
        <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Start selling to see your products here</p>
        <a
          href="/sell"
          className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors ${
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
    <div className="grid grid-cols-3 gap-1 md:gap-2 mt-1">
      {products.map((product) => (
        <ProductGridItem key={product.id} product={product} />
      ))}
    </div>
  )
}
