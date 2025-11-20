# Depop Moldova - Marketplace Web App

A modern marketplace web application inspired by Depop, built with Next.js 15 and Supabase. Users can buy and sell clothing items with features like real-time messaging, likes, and user profiles.

## Features

- 🔐 **Authentication** - User signup/login with Supabase Auth
- 📸 **Product Listings** - Upload and browse clothing items with multiple images
- 🔍 **Search & Filter** - Search products by keywords and filter by categories
- ❤️ **Likes** - Save favorite items to your likes collection
- 💬 **Real-time Messaging** - Chat with buyers and sellers in real-time
- 👤 **User Profiles** - View seller profiles with their active and sold listings
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🎨 **Modern UI** - Clean, intuitive interface inspired by Depop

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up (this takes a few minutes)
3. Go to Project Settings > API
4. Copy your project URL and anon key

### 3. Configure Environment Variables

Update the `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run it in the SQL Editor

This will create all necessary tables, policies, and storage buckets.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
depop-marketplace/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/supabase/          # Supabase client configuration
├── types/                 # TypeScript type definitions
├── supabase/migrations/   # Database schema
└── middleware.ts          # Auth middleware
```

## Key Features

### Authentication
- Implemented with Supabase Auth
- Automatic profile creation on signup
- Protected routes via middleware

### Product Management
- Multi-image upload to Supabase Storage
- Category filtering
- Size and condition tracking
- Mark items as sold

### Real-time Messaging
- Built with Supabase Realtime
- Conversation grouping
- Message history

### Likes System
- Toggle like/unlike functionality
- View all liked items
- Like count display

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

## Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## License

MIT

---

Built with ❤️ using Next.js and Supabase

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
