# Depop Moldova - Setup Guide

This guide will walk you through setting up the Depop Moldova marketplace application from scratch.

## Quick Start (5 minutes)

### Step 1: Supabase Setup

1. **Create a Supabase Account**
   - Go to https://supabase.com
   - Sign up or log in
   - Click "New Project"
   - Choose an organization (or create one)
   - Fill in:
     - Project name: `depop-moldova`
     - Database password: (generate a strong password and save it)
     - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

2. **Get API Credentials**
   - Once ready, click on "Project Settings" (gear icon)
   - Go to "API" section
   - Copy these two values:
     - Project URL (starts with https://...)
     - anon/public key (long string starting with eyJ...)

3. **Set Up Database**
   - Click on "SQL Editor" in the sidebar
   - Click "New Query"
   - Open the file `supabase/migrations/001_initial_schema.sql` from this project
   - Copy ALL the contents
   - Paste into the SQL Editor
   - Click "Run" button
   - You should see "Success. No rows returned"

4. **Verify Setup**
   - Click on "Table Editor" in sidebar
   - You should see tables: profiles, products, likes, messages
   - Click on "Storage" in sidebar
   - You should see bucket: product-images

### Step 2: Application Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Open `.env.local` file
   - Replace the placeholder values with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Run the App**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Go to http://localhost:3000
   - You should see the marketplace homepage

### Step 3: Test the Application

1. **Create an Account**
   - Click "Sign Up"
   - Enter username, email, and password
   - Click "Sign up"

2. **List Your First Item**
   - Click "Sell" in navigation
   - Upload 1-6 photos
   - Fill in details:
     - Title: "Vintage Denim Jacket"
     - Price: 45.00
     - Category: Outerwear
     - Condition: Good
   - Click "List Item"

3. **Test Features**
   - Browse items on homepage
   - Click heart icon to like items
   - Search for items
   - Filter by category
   - View product details
   - Check your profile

## Troubleshooting

### "Cannot connect to Supabase"
- Check that your `.env.local` file has correct values
- Make sure you copied the entire URL and key
- Restart the dev server: `npm run dev`

### "Row Level Security policy violation"
- Make sure you ran the entire SQL migration
- Check that RLS policies were created in Supabase dashboard
- Re-run the migration if needed

### Images not uploading
- Verify the `product-images` bucket exists in Supabase Storage
- Check that storage policies were created
- Make sure you're logged in when trying to upload

### Page not found errors
- Clear your browser cache
- Delete `.next` folder and run `npm run dev` again
- Check that all files are in correct directories

## Development Tips

### Viewing Database Data

1. Go to Supabase dashboard
2. Click "Table Editor"
3. Select a table to view/edit data
4. You can manually add/edit/delete rows here for testing

### Viewing Uploaded Images

1. Go to Supabase dashboard
2. Click "Storage"
3. Click "product-images"
4. Browse uploaded images

### Testing Real-time Messages

1. Open app in two different browsers (or incognito + normal)
2. Sign up as two different users
3. User 1: Create a product listing
4. User 2: View the product and click "Message"
5. Send messages back and forth
6. They should appear in real-time

### Resetting the Database

If you need to start fresh:

1. Go to SQL Editor in Supabase
2. Run this to delete all data:
```sql
TRUNCATE profiles, products, likes, messages CASCADE;
```

3. Or to completely recreate tables:
```sql
DROP TABLE IF EXISTS messages, likes, products, profiles CASCADE;
```
Then re-run the migration.

## Common Tasks

### Adding a New Category

Edit `app/sell/page.tsx` and `components/SearchBar.tsx`:
```typescript
const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Your New Category', 'Other']
```

### Changing Colors

Edit `tailwind.config.ts` to customize the color scheme. The app mainly uses:
- Primary: indigo-600
- Background: gray-50
- Text: gray-900

### Adding Email Notifications

1. Go to Supabase dashboard > Authentication > Email Templates
2. Customize the email templates
3. Enable email confirmations if desired

## Production Deployment Checklist

- [ ] Update `.env.local` to `.env.production`
- [ ] Set up custom domain in Supabase (optional)
- [ ] Enable email confirmations in Supabase Auth
- [ ] Configure SMTP for emails (optional)
- [ ] Set up proper error logging
- [ ] Add analytics (optional)
- [ ] Test on mobile devices
- [ ] Run `npm run build` to check for errors
- [ ] Deploy to Vercel/Netlify
- [ ] Add environment variables in deployment platform
- [ ] Test production deployment thoroughly

## Need Help?

- **Supabase Issues**: Check https://supabase.com/docs
- **Next.js Issues**: Check https://nextjs.org/docs
- **General Questions**: Open an issue on GitHub

Good luck with your marketplace! 🚀
