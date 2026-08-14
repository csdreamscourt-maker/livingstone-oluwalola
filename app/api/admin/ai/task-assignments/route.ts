import { NextRequest, NextResponse } from 'next/server';
import { listAiTaskAssignments, setAiTaskAssignment } from '@/lib/db';
import { requireAdminSession } from '@/lib/session';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const assignments = await listAiTaskAssignments();
  return NextResponse.json({ assignments });
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.task_key) {
    return NextResponse.json({ error: 'task_key is required' }, { status: 400 });
  }

  const assignment = await setAiTaskAssignment(
    body.task_key,
    body.primary_model_id || null,
    Array.isArray(body.fallback_model_ids) ? body.fallback_model_ids : []
  );

  return NextResponse.json({ assignment });
}
