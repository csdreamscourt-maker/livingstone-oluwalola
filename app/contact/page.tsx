'use client';

import { useState } from 'react';
import { Container, Section, Card } from '@/components/ui';
import { Hero } from '@/components/sections';
import { CheckCircle, AlertCircle, Mail, MapPin, Clock } from 'lucide-react';

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
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <>
      <Hero
        subtitle="Get in Touch"
        title="Let's Connect"
        description="Reach out with inquiries, partnership opportunities, or to learn more about our work."
      />

      <Section padding="2xl">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Mail,
                title: 'Email',
                content: 'contact@livingstone.com',
              },
              {
                icon: MapPin,
                title: 'Office',
                content: 'Global Operations',
              },
              {
                icon: Clock,
                title: 'Response Time',
                content: '24-48 hours',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  variant="bordered"
                  className="text-center hover:border-gold-600 hover:shadow-lg transition-all duration-300 animate-slideUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-block p-3 bg-gold-600 bg-opacity-10 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-gold-600" />
                  </div>
                  <p className="text-sm font-medium text-gold-600 mb-2 uppercase tracking-wider">
                    {item.title}
                  </p>
                  <p className="text-lg text-midnight-950 font-serif font-bold">
                    {item.content}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-midnight-950 mb-4">
                Send us a Message
              </h2>
              <p className="text-lg text-gray-600">
                We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-midnight-950 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg text-midnight-950 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-500/20"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-midnight-950 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg text-midnight-950 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-500/20"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-midnight-950 mb-3">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg text-midnight-950 transition-all duration-300 focus:outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-500/20"
                >
                  <option value="">Select a subject</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="speaking">Speaking Engagement</option>
                  <option value="consulting">Advisory/Consulting</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-midnight-950 mb-3">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-6 py-4 bg-white border border-gray-300 rounded-lg text-midnight-950 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-500/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-8 py-4 bg-gold-600 text-midnight-950 font-semibold rounded-lg hover:bg-gold-500 hover:shadow-lg hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <div className="flex items-center gap-3 p-4 bg-emerald-600 bg-opacity-20 border border-emerald-500 border-opacity-30 rounded-lg animate-slideUp">
                  <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
                  <p className="text-emerald-200">
                    Message sent successfully. We'll get back to you soon.
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-600 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg animate-shake">
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-200">
                    Something went wrong. Please try again.
                  </p>
                </div>
              )}
            </form>
          </div>
        </Container>
      </Section>
    </>
  );
}
