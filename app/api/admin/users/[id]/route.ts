import { NextRequest, NextResponse } from 'next/server';
import { updateUserRole } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Context) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  const { role } = await req.json();
  if (role !== 'user' && role !== 'admin') {
    return NextResponse.json({ error: 'role must be "user" or "admin"' }, { status: 400 });
  }

  const user = await updateUserRole(id, role);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}
