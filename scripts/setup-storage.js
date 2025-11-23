/**
 * Setup Supabase Storage Buckets
 * Run this script once to create the required storage buckets
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupStorage() {
  console.log('🚀 Setting up Supabase Storage buckets...\n')

  // Create avatars bucket
  console.log('📁 Creating "avatars" bucket...')
  const { data: avatarsBucket, error: avatarsError } = await supabase.storage.createBucket('avatars', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
  })

  if (avatarsError) {
    if (avatarsError.message.includes('already exists')) {
      console.log('✅ Avatars bucket already exists')
    } else {
      console.error('❌ Error creating avatars bucket:', avatarsError.message)
    }
  } else {
    console.log('✅ Avatars bucket created successfully')
  }

  // Create product-images bucket
  console.log('\n📁 Creating "product-images" bucket...')
  const { data: productsBucket, error: productsError } = await supabase.storage.createBucket('product-images', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
  })

  if (productsError) {
    if (productsError.message.includes('already exists')) {
      console.log('✅ Product-images bucket already exists')
    } else {
      console.error('❌ Error creating product-images bucket:', productsError.message)
    }
  } else {
    console.log('✅ Product-images bucket created successfully')
  }

  // List all buckets to verify
  console.log('\n📋 Current storage buckets:')
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  
  if (listError) {
    console.error('❌ Error listing buckets:', listError.message)
  } else {
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })
  }

  console.log('\n✨ Storage setup complete!')
  console.log('\n💡 Next steps:')
  console.log('   1. Go to Supabase Dashboard → Storage')
  console.log('   2. Verify the buckets are created')
  console.log('   3. Try uploading a profile picture again')
}

setupStorage().catch(error => {
  console.error('❌ Setup failed:', error)
  process.exit(1)
})
