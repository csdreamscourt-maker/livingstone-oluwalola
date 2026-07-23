import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserAuthByEmail, getUser } from '@/lib/db';
import { createSessionCookie } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('Login error: JWT_SECRET is not set');
      return NextResponse.json({ error: 'Server misconfigured: JWT_SECRET is not set' }, { status: 500 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const userAuth = await getUserAuthByEmail(normalizedEmail);

    if (!userAuth) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, userAuth.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await createSessionCookie({ sub: userAuth.id, email: userAuth.email, role: userAuth.role });

    const user = await getUser(userAuth.id);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
