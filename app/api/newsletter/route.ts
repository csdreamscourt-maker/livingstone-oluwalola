export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Invalid email' }, { status: 400 });
    }

    return Response.json({ success: true, message: 'Subscribed successfully' });
  } catch {
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
