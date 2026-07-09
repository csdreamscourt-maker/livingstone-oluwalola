import { subscribeToNewsletter } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }

    await subscribeToNewsletter(email);

    return Response.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
