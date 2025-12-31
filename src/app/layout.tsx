import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { QueryProvider } from '@/components/QueryProvider';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gratitudeflow.app';

export const metadata: Metadata = {
  title: 'GratitudeFlow | AI-Powered Gratitude Journaling & Reflection',
  description: 'Unleash the power of gratitude with GratitudeFlow, your personal AI companion for daily reflection, positive mindset shifts, and tracking emotional well-being.',
  keywords: ['gratitude journal', 'AI journal', 'mindfulness app', 'positive affirmations', 'mental wellness', 'self-reflection', 'daily journal'],
  authors: [{ name: 'GratitudeFlow Team' }],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'GratitudeFlow | AI-Powered Gratitude Journaling',
    description: 'Transform your mindset with daily reflections and AI-powered insights. Start your journey to a more positive life today.',
    images: [
      {
        url: '/og-image.png', // You should create this image and place it in the /public folder
        width: 1200,
        height: 630,
        alt: 'GratitudeFlow App Interface',
      },
    ],
    siteName: 'GratitudeFlow',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@GratitudeFlowApp', // Replace with your actual Twitter handle
    creator: '@GratitudeFlowApp', // Replace with your actual Twitter handle
    title: 'GratitudeFlow | AI-Powered Gratitude & Reflection',
    description: 'Discover the power of AI-driven gratitude journaling with GratitudeFlow. Your personal companion for a happier, more mindful life.',
    images: [`${siteUrl}/twitter-image.png`], // You should create this image and place it in the /public folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased bg-background`}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
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
