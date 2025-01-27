import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-providers";
import { Space_Grotesk } from 'next/font/google'
 
const inter = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-inter',
weight: [ "400", "700"],
display: "swap",
})

export const metadata: Metadata = {
  title: "EIPs Insights",
  description: "EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of Ethereum Improvement Proposal (EIP).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter} antialiased`}
      >
                  <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
