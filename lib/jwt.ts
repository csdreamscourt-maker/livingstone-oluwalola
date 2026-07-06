import jwt from 'jsonwebtoken';

export type SessionPayload = {
  sub: string;
  email: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

export function signSessionToken(payload: SessionPayload): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySessionToken(token: string): SessionPayload | null {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = 'dreamscourt_session';
