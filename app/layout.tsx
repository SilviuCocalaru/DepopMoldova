import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Depop Moldova - Marketplace for Clothing",
  description: "Discover unique fashion finds on Depop Moldova. Buy and sell pre-loved clothing, vintage pieces, and trendy fashion items. Join our community of fashion lovers and find your next favorite outfit while selling items from your closet.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Depop MD",
  },
  icons: {
    icon: [
      { url: "/icon-72.png", sizes: "72x72", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-128.png", sizes: "128x128", type: "image/png" },
      { url: "/icon-144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon-152.png", sizes: "152x152", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-384.png", sizes: "384x384", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  // Note: manifest should work but Next.js may not render it properly
  // We add it explicitly in the head tag below
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#ef4444",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user's theme preference
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  let userTheme: 'light' | 'dark' = 'light'
  
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('theme')
      .eq('id', session.user.id)
      .single()
    
    userTheme = (profile?.theme as 'light' | 'dark') || 'light'
  }

  return (
    <html lang="en" suppressHydrationWarning className={userTheme}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-900 text-black dark:text-white transition-colors`}
        suppressHydrationWarning
      >
        <ThemeProvider initialTheme={userTheme}>
          {children}
        </ThemeProvider>
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/service-worker.js')
                    .then((registration) => {
                      console.log('SW registered:', registration.scope);
                    })
                    .catch((error) => {
                      console.log('SW registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
