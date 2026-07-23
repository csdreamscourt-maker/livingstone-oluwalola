import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '@/lib/db';
import { createSessionCookie } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('Signup error: JWT_SECRET is not set');
      return NextResponse.json({ error: 'Server misconfigured: JWT_SECRET is not set' }, { status: 500 });
    }

    const { fullName, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await getUserByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser(normalizedEmail, passwordHash, fullName?.trim());

    await createSessionCookie({ sub: user.id, email: user.email, role: user.role });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
