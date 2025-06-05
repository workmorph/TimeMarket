import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;

// Email sending utility functions
export async function sendEmail({
  to,
  subject,
  react,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  react?: React.ReactElement;
  html?: string;
  text?: string;
}) {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@timebid.com',
      to,
      subject,
      react,
      html,
      text,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

// Batch email sending
export async function sendBatchEmails(emails: Array<{
  to: string | string[];
  subject: string;
  react?: React.ReactElement;
  html?: string;
  text?: string;
}>) {
  try {
    const data = await resend.batch.send(
      emails.map(email => ({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@timebid.com',
        ...email,
      }))
    );

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send batch emails:', error);
    return { success: false, error };
  }
}