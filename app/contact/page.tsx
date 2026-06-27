'use client';

import { useState } from 'react';
import { Container, Section, Card, Input, Textarea, Select, Button, Alert } from '@/components/ui';
import { Hero } from '@/components/sections';
import { Mail, MapPin, Clock } from 'lucide-react';

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
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />

              <Select
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Select a subject"
                options={[
                  { value: 'partnership', label: 'Partnership Inquiry' },
                  { value: 'speaking', label: 'Speaking Engagement' },
                  { value: 'consulting', label: 'Advisory/Consulting' },
                  { value: 'general', label: 'General Inquiry' },
                ]}
              />

              <Textarea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us more about your inquiry..."
                maxLength={1000}
              />

              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={status === 'loading'}
                className="w-full"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </Button>

              {status === 'success' && (
                <Alert type="success" title="Success!">
                  Message sent successfully. We'll get back to you soon.
                </Alert>
              )}

              {status === 'error' && (
                <Alert type="error" title="Error">
                  Something went wrong. Please try again.
                </Alert>
              )}
            </form>
          </div>
        </Container>
      </Section>
    </>
  );
}
