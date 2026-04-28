import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/app/_schema/absolute-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: absoluteUrl('/'), lastModified },
    { url: absoluteUrl('/projects'), lastModified },
    { url: absoluteUrl('/privacy'), lastModified },
    // { url: absoluteUrl('/mentorship'), lastModified },
  ]
}
