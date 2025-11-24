import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'

export const dynamic = 'force-dynamic'

export default async function TutorialPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  let theme: 'light' | 'dark' = 'light'
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('theme')
      .eq('id', session.user.id)
      .single()
    
    theme = (profile?.theme as 'light' | 'dark') || 'light'
  }
  
  const isDark = theme === 'dark'
  const t = await getTranslations('tutorial')

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="hidden md:block">
        <Header />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <h1 className={`text-4xl font-bold mb-8 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          How to Use Depop Moldova
        </h1>

        {/* Buying Section */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            🛍️ Buying Items
          </h2>
          <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">1. Browse & Search</h3>
              <p>Use the search bar or browse categories to find items you like.</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">2. View Details</h3>
              <p>Click on any item to see photos, description, price, and seller info.</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">3. Message Seller</h3>
              <p>Have questions? Use the message button to chat with the seller.</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">4. Save Favorites</h3>
              <p>Heart items you love to save them for later in your Likes.</p>
            </div>
          </div>
        </section>

        {/* Selling Section */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            💰 Selling Items
          </h2>
          <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">1. Take Good Photos</h3>
              <p>Clear, well-lit photos sell faster. Show the item from multiple angles.</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">2. Write a Description</h3>
              <p>Include size, condition, brand, and any flaws. Be honest!</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">3. Set a Fair Price</h3>
              <p>Check similar items to price competitively. Remember: no selling fees!</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">4. Respond to Messages</h3>
              <p>Quick responses lead to faster sales. Be friendly and professional.</p>
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            🔒 Safety Tips
          </h2>
          <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">✓ Meet in Public Places</h3>
              <p>For local pickups, always meet in busy, well-lit public areas.</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">✓ Check Items Before Buying</h3>
              <p>Inspect items carefully before completing the purchase.</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">✓ Trust Your Instincts</h3>
              <p>If something feels wrong, walk away. Your safety comes first.</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-2">✗ Never Share Personal Info</h3>
              <p>Keep financial details private. Use the in-app messaging.</p>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            ⭐ Community Guidelines
          </h2>
          <div className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <p>• Be respectful and kind to all users</p>
            <p>• Only sell items you own</p>
            <p>• Describe items accurately</p>
            <p>• No counterfeit or prohibited items</p>
            <p>• Honor your commitments</p>
            <p>• Report suspicious activity</p>
          </div>
        </section>

        {/* Call to Action */}
        <div className={`p-8 rounded-lg text-center ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Ready to Get Started?
          </h2>
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join our community and start buying or selling today!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="/search"
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Start Shopping
            </a>
            <a 
              href="/sell"
              className={`px-6 py-3 rounded-md font-medium border transition-colors ${
                isDark 
                  ? 'border-gray-600 text-gray-100 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-900 hover:bg-gray-100'
              }`}
            >
              Sell an Item
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
