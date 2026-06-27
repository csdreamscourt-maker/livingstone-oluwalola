export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    return Response.json({ success: true, message: 'Message received' });
  } catch {
    return Response.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
