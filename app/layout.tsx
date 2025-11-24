import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { cookies } from "next/headers";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/components/ThemeProvider";
import IntlProvider from "@/components/IntlProvider";
import ClientLayout from "@/components/ClientLayout";

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
  // Fetch user's theme and language preference
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  let userTheme: 'light' | 'dark' = 'light'
  let locale: 'en' | 'ro' | 'ru' = 'ro'
  
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('theme, language')
      .eq('id', session.user.id)
      .single()
    
    userTheme = (profile?.theme as 'light' | 'dark') || 'light'
    if (profile?.language && (profile.language === 'en' || profile.language === 'ro' || profile.language === 'ru')) {
      locale = profile.language
    }
  } else {
    // Check for guest language cookie
    const cookieStore = await cookies()
    const localeCookie = cookieStore.get('NEXT_LOCALE')
    if (localeCookie?.value && (localeCookie.value === 'en' || localeCookie.value === 'ro' || localeCookie.value === 'ru')) {
      locale = localeCookie.value as 'en' | 'ro' | 'ru'
    }
  }

  // Load messages for the user's language
  const messagesModule = await import(`../messages/${locale}.json`)
  const messages = messagesModule.default

  return (
    <html lang={locale} suppressHydrationWarning className={userTheme}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-900 text-black dark:text-white transition-colors`}
        suppressHydrationWarning
      >
        <IntlProvider locale={locale} messages={messages}>
          <ThemeProvider initialTheme={userTheme}>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ThemeProvider>
        </IntlProvider>
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
