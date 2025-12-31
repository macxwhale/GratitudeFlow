import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { QueryProvider } from '@/components/QueryProvider';

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
      <body className={`${GeistSans.variable} font-sans antialiased bg-background`}>
        <QueryProvider>
          <FirebaseClientProvider>
            {children}
            <Toaster />
          </FirebaseClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
