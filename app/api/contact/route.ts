import { createContactMessage } from '@/lib/db';
import { sendEmailBestEffort } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await createContactMessage({ name, email, subject, message });

    const notifyTo = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (notifyTo) {
      await sendEmailBestEffort({
        to: notifyTo,
        subject: `New contact message: ${subject}`,
        html: `<p><strong>${name}</strong> (${email}) wrote:</p><p>${message}</p>`,
      });
    }

    return Response.json({ success: true, message: 'Message received' });
  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
