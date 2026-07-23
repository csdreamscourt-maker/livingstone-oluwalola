import { subscribeToNewsletter } from '@/lib/db';
import { sendEmailBestEffort } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }

    await subscribeToNewsletter(email);

    await sendEmailBestEffort({
      to: email,
      subject: 'Welcome to Masterminds',
      html: '<p>You\'re on the list — we\'ll be in touch as soon as Masterminds opens.</p>',
    });

    return Response.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
