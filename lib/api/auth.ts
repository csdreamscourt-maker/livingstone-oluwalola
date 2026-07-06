import type { User } from '@/types/database';

async function parseOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export async function signup(input: { fullName: string; email: string; password: string }): Promise<User> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await parseOrThrow<{ user: User }>(res);
  return data.user;
}

export async function login(input: { email: string; password: string }): Promise<User> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await parseOrThrow<{ user: User }>(res);
  return data.user;
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export async function fetchCurrentUser(): Promise<User | null> {
  const res = await fetch('/api/auth/me');
  if (res.status === 401) return null;
  const data = await parseOrThrow<{ user: User }>(res);
  return data.user;
}
