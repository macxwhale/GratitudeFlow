import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Changed to single Geist import for sans-serif
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Added Toaster

const geistSans = Geist({ // Using Geist Sans
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Added for font display strategy
});

export const metadata: Metadata = {
  title: 'GratitudeFlow',
  description: 'Flow into gratitude and positivity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
