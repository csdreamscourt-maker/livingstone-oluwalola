'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser, logout as apiLogout } from '@/lib/api/auth';
import type { User } from '@/types/database';

export function useAdminSession() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const currentUser = await fetchCurrentUser();
      if (!currentUser) {
        router.replace('/auth/login');
        return;
      }
      if (currentUser.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    })();
  }, [router]);

  const logout = async () => {
    await apiLogout();
    router.push('/auth/login');
  };

  return { user, loading, logout };
}
