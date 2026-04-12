import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { ContactEmailData } from './contact-types'

type ContactEmailProps = {
  data: ContactEmailData
}

export function ContactEmail({ data }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New portfolio contact from {data.name}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>New contact form submission</Heading>

          <Section>
            <Text style={textStyle}>
              <strong>From:</strong> {data.name} &lt;{data.email}&gt;
            </Text>
            {data.subject && (
              <Text style={textStyle}>
                <strong>Subject:</strong> {data.subject}
              </Text>
            )}
            {data.budget && (
              <Text style={textStyle}>
                <strong>Budget:</strong> {data.budget}
              </Text>
            )}
            <Text style={textStyle}>
              <strong>Mode:</strong> {data.mode}
            </Text>
          </Section>

          <Hr style={hrStyle} />

          {data.message && (
            <Section>
              <Text style={messageStyle}>{data.message}</Text>
            </Section>
          )}

          {data.mode === 'voice' && data.recordingCount > 0 && (
            <Section>
              <Text style={textStyle}>
                {data.recordingCount} voice recording(s) attached as audio/webm
                files.
              </Text>
            </Section>
          )}
        </Container>
      </Body>
    </Html>
  )
}

const bodyStyle = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}

const containerStyle = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '32px',
  borderRadius: '8px',
  maxWidth: '580px',
}

const headingStyle = {
  fontSize: '20px',
  fontWeight: '600' as const,
  color: '#1a1a1a',
  marginBottom: '24px',
}

const textStyle = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#333333',
  margin: '4px 0',
}

const messageStyle = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#333333',
  whiteSpace: 'pre-wrap' as const,
}

const hrStyle = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}
