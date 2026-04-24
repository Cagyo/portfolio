import type { MetadataRoute } from 'next'
import { siteConfig } from '@/app/_config/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: siteConfig.url, lastModified },
    { url: `${siteConfig.url}/projects`, lastModified },
  ]
}
