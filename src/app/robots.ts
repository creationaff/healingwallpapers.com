import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Disallow API routes and admin areas
    },
    sitemap: 'https://healingwallpapers.com/sitemap.xml',
  };
}

