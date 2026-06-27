'use client';

import { useState } from 'react';
import { Container, Section } from '@/components/ui';
import { Hero } from '@/components/sections';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <>
      <Hero
        subtitle="Get in Touch"
        title="Let's Connect"
        description="Reach out with inquiries, partnership opportunities, or to learn more about our work."
      />

      <Section padding="lg">
        <Container size="sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: 'Email',
                content: 'contact@livingstone.com',
              },
              {
                title: 'Office',
                content: 'Global Operations',
              },
              {
                title: 'Response Time',
                content: '24-48 hours',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <p className="text-sm font-medium text-gold-600 mb-2 uppercase tracking-wider">
                  {item.title}
                </p>
                <p className="text-lg text-midnight-950 font-serif font-bold">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-midnight-950 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-400/20"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-midnight-950 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-400/20"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-midnight-950 mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-400/20"
              >
                <option value="">Select a subject</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="speaking">Speaking Engagement</option>
                <option value="consulting">Advisory/Consulting</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-midnight-950 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-400/20 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-6 py-3 bg-midnight-950 text-white font-medium rounded-lg hover:bg-midnight-800 disabled:bg-stone-400 transition-colors"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className="text-center text-sm text-green-600 mt-4">
                Message sent successfully. We'll get back to you soon.
              </p>
            )}

            {status === 'error' && (
              <p className="text-center text-sm text-red-600 mt-4">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </Container>
      </Section>
    </>
  );
}
