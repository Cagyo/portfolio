import { getTranslations } from 'next-intl/server'
import { renderOg, size, contentType } from '@/app/_og/og-template'

export { size, contentType }
export const alt = 'Privacy — Oleksii Berliziev'

export default async function Image() {
  const t = await getTranslations({ locale: 'en', namespace: 'og.privacy' })
  return renderOg({
    eyebrow: t('eyebrow'),
    title: t('title'),
    description: t('description'),
  })
}