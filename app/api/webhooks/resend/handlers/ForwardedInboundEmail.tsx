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

type ForwardedInboundEmailProps = {
  from: string
  to: string
  subject: string
  text?: string
  attachmentNames: string[]
}

export function ForwardedInboundEmail({
  from,
  to,
  subject,
  text,
  attachmentNames,
}: ForwardedInboundEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Forwarded inbound: {subject || '(no subject)'}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>Forwarded inbound email</Heading>
          <Section>
            <Text style={textStyle}>
              <strong>From:</strong> {from}
            </Text>
            <Text style={textStyle}>
              <strong>To:</strong> {to}
            </Text>
            <Text style={textStyle}>
              <strong>Subject:</strong> {subject || '(no subject)'}
            </Text>
          </Section>

          <Hr style={hrStyle} />

          {text && (
            <Section>
              <Text style={messageStyle}>{text}</Text>
            </Section>
          )}

          {attachmentNames.length > 0 && (
            <Section>
              <Text style={textStyle}>
                <strong>Attachments ({attachmentNames.length}):</strong>
              </Text>
              {attachmentNames.map((name) => (
                <Text key={name} style={textStyle}>
                  • {name}
                </Text>
              ))}
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
