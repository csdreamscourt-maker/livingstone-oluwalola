export type DreamscourtUser = {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type DreamscourtSession = {
  userId: string;
  email: string;
  fullName: string;
  createdAt: string;
};

const USER_STORAGE_KEY = 'dreamscourt-users';
const SESSION_STORAGE_KEY = 'dreamscourt-session';

function hashPassword(password: string) {
  if (typeof window === 'undefined') {
    return password;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  return crypto.subtle.digest('SHA-256', data).then((buffer) => {
    const bytes = Array.from(new Uint8Array(buffer));
    return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  });
}

function readUsers(): DreamscourtUser[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DreamscourtUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: DreamscourtUser[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

export async function registerUser(input: { fullName: string; email: string; password: string }) {
  const users = readUsers();
  const existing = users.find((user) => user.email.toLowerCase() === input.email.toLowerCase());
  if (existing) {
    throw new Error('An account with that email already exists.');
  }

  const passwordHash = await hashPassword(input.password);
  const user: DreamscourtUser = {
    id: `user-${Math.random().toString(36).slice(2, 10)}`,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  const nextUsers = [user, ...users];
  writeUsers(nextUsers);

  const session: DreamscourtSession = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt,
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  return session;
}

export async function loginUser(input: { email: string; password: string }) {
  const users = readUsers();
  const user = users.find((entry) => entry.email.toLowerCase() === input.email.trim().toLowerCase());
  if (!user) {
    throw new Error('No account found for that email.');
  }

  const passwordHash = await hashPassword(input.password);
  if (user.passwordHash !== passwordHash) {
    throw new Error('Invalid password.');
  }

  const session: DreamscourtSession = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt,
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  return session;
}

export function getCurrentSession(): DreamscourtSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DreamscourtSession) : null;
  } catch {
    return null;
  }
}

export function signOutUser() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    window.localStorage.removeItem('auth_token');
  }
}
