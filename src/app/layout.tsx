'use client';
import './globals.css';
import { ThemeProvider } from '@/components/theme-providers';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import { useState, useEffect } from 'react';
import Loader from '@/components/ui/Loader2';

// import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import { AppSidebar } from '@/components/layout/SideBar';


const inter = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '700'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {loading ? (
          <Loader />
        ) : (
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* <SidebarProvider> */}
              <div className="flex min-h-screen">
                {/* <AppSidebar /> */}
                <main className="flex-1">
                  <Navbar />
  
                  {children}
                </main>
              </div>
            {/* </SidebarProvider> */}
          </ThemeProvider>
        )}
      </body>
    </html>
  );
}
