'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

type AdminUserRow = {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin';
  created_at: string;
  dream_count: string;
  journal_count: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const toggleRole = async (user: AdminUserRow) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    setUpdatingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout title="Users">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        {loading && <p className="p-5 text-sm text-white/50">Loading...</p>}
        {!loading && users.length === 0 && <p className="p-5 text-sm text-white/50">No users yet.</p>}
        {users.map((user) => (
          <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-3.5 last:border-b-0">
            <div>
              <p className="text-sm font-semibold text-white">{user.full_name || user.email}</p>
              <p className="text-xs text-white/40">
                {user.email} · {user.dream_count} dreams · {user.journal_count} journal entries
              </p>
            </div>
            <button
              onClick={() => toggleRole(user)}
              disabled={updatingId === user.id}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-200 disabled:opacity-50 ${
                user.role === 'admin' ? 'bg-gold-500/15 text-gold-300' : 'border border-white/15 text-white/50 hover:text-white'
              }`}
            >
              {user.role === 'admin' ? 'Admin — click to demote' : 'Make admin'}
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
