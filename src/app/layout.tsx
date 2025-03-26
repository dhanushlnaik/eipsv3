"use client";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-providers";
import { Space_Grotesk } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { useState, useEffect } from "react";
import Loader from "@/components/ui/Loader";

const inter = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "700"],
  display: "swap",
});

// export const metadata: Metadata = {
//   title: "EIPs Insights",
//   description:
//     "EIPsInsight is specialized in toolings designed to provide clear, visual insights into the activity of Ethereum Improvement Proposal (EIP).",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Adjust timeout as needed
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {loading ? (
          <Loader/>
        ) : (
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        )}
      </body>
    </html>
  );
}
