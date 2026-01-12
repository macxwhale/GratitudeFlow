import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gratitudeflow.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/reflections', '/history', '/account'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}