import 'server-only';
import { Resend } from 'resend';

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Dreamscourt <no-reply@dreamscourt.app>';

  if (!apiKey) {
    throw new Error('Email is not configured (missing RESEND_API_KEY)');
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({ from, to, subject, html });
}

/** Sends best-effort; swallows failures so a missing/broken email config never breaks the calling request. */
export async function sendEmailBestEffort(input: SendEmailInput): Promise<void> {
  try {
    await sendEmail(input);
  } catch (error) {
    console.error('Email send failed (non-fatal):', error instanceof Error ? error.message : error);
  }
}
