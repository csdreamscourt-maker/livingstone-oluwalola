'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout title="Messages">
      <div className="space-y-3">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && messages.length === 0 && <p className="text-sm text-gray-500">No contact messages yet.</p>}
        {messages.map((message) => (
          <div key={message.id} className="rounded-xl border border-midnight-950/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-midnight-950">
                {message.subject} <span className="font-normal text-gray-500">from {message.name}</span>
              </p>
              <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
            </div>
            <p className="mt-1 text-xs text-gold-700">{message.email}</p>
            <p className="mt-3 text-sm leading-6 text-gray-600">{message.message}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
