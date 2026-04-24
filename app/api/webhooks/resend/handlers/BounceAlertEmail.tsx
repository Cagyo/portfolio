import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

type Variant = 'bounce' | 'complaint'

type BounceAlertEmailProps = {
  variant: Variant
  recipient: string
  messageId: string
  timestamp: string
  reason?: string
  detail?: string
}

const HEADINGS: Record<Variant, string> = {
  bounce: 'Email bounce detected',
  complaint: 'Spam complaint received',
}

export function BounceAlertEmail({
  variant,
  recipient,
  messageId,
  timestamp,
  reason,
  detail,
}: BounceAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{HEADINGS[variant]} — {recipient}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>{HEADINGS[variant]}</Heading>
          <Section>
            <Text style={textStyle}>
              <strong>Recipient:</strong> {recipient}
            </Text>
            <Text style={textStyle}>
              <strong>Message ID:</strong> {messageId}
            </Text>
            <Text style={textStyle}>
              <strong>Timestamp:</strong> {timestamp}
            </Text>
            {reason && (
              <Text style={textStyle}>
                <strong>{variant === 'bounce' ? 'Bounce type' : 'Feedback type'}:</strong> {reason}
              </Text>
            )}
            {detail && (
              <Text style={textStyle}>
                <strong>Detail:</strong> {detail}
              </Text>
            )}
            <Text style={textStyle}>
              Search server logs for <code>{messageId}</code> to find the originating submission.
            </Text>
          </Section>
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
