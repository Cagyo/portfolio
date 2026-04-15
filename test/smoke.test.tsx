import { renderWithIntl } from './helpers/render-with-intl'
import { screen } from '@testing-library/react'
import { useTranslations } from 'next-intl'

function SampleComponent() {
  const t = useTranslations('common')
  return <p data-testid="author">{t('author')}</p>
}

describe('testing infrastructure smoke test', () => {
  it('renders a component with next-intl translations', () => {
    renderWithIntl(<SampleComponent />)
    expect(screen.getByTestId('author')).toBeInTheDocument()
    expect(screen.getByTestId('author')).toHaveTextContent('Oleksii Berliziev')
  })

  it('exposes real messages from en.json', async () => {
    const { messages } = await import('./helpers/render-with-intl')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((messages as any).common.author).toBe('Oleksii Berliziev')
  })
})
