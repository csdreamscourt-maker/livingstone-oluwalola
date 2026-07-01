'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import { Mail, Send, Check, AlertCircle, Sparkles } from 'lucide-react';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section className="relative py-24 md:py-28 overflow-hidden">
      {/* Decorative gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-fuchsia-50/40 to-cyan-50" />
      <div
        className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
      />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="relative p-8 md:p-12 lg:p-14 rounded-3xl glass-card shadow-premium overflow-hidden">
            {/* Gradient accent stripe */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef, #ec4899)' }}
            />

            <div className="relative text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-6 shadow-glow-violet">
                <Mail size={28} className="text-white" />
              </div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-[0.2em]">
                <Sparkles size={12} />
                Newsletter
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight">
                Join the{' '}
                <span className="text-gradient-primary">Community</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Weekly insights on leadership, faith, and systems thinking delivered to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                  className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border border-gray-200 text-midnight-950 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-white shadow-glow-violet hover:scale-[1.03] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)' }}
              >
                {status === 'loading' ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Subscribing
                  </>
                ) : (
                  <>
                    Subscribe
                    <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </form>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mt-5 text-sm font-medium text-emerald-600"
              >
                <Check size={16} />
                Thank you! Check your email for confirmation.
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mt-5 text-sm font-medium text-red-600"
              >
                <AlertCircle size={16} />
                Something went wrong. Please try again.
              </motion.div>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
