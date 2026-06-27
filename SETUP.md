# Livingstone Digital Ecosystem - Setup Guide

## Overview

This is the official digital headquarters for Livingstone - a premium platform integrating a brand website with the Dreamscourt application (AI-powered dream journal, prayer tracking, and personal insights).

**Tech Stack:**
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- Backend: Supabase (PostgreSQL), Node.js
- AI: OpenAI GPT-4 for dream interpretation
- Authentication: Clerk (recommended) or Supabase Auth
- Storage: AWS S3 for voice recordings and media
- Deployment: Vercel

## Project Structure

```
livingstone-web/
├── app/                          # Next.js App Router
│   ├── (pages)                   # Marketing pages
│   │   ├── about/
│   │   ├── articles/
│   │   ├── companies/
│   │   ├── community/
│   │   ├── contact/
│   │   ├── dashboard/            # Dreamscourt dashboard
│   │   ├── frameworks/
│   │   ├── ideas/
│   │   ├── resources/
│   │   └── speaking/
│   ├── api/                      # API routes
│   │   ├── contact/
│   │   ├── newsletter/
│   │   └── dreams/
│   ├── layout.tsx                # Root layout with Header/Footer
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles and design tokens
├── components/
│   ├── ui/                       # Atomic UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   └── index.ts
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   └── sections/                 # Page section components
│       ├── Hero.tsx
│       ├── FeaturedContent.tsx
│       ├── NewsletterCTA.tsx
│       └── index.ts
├── lib/
│   ├── utils.ts                  # Utility functions
│   ├── constants.ts              # Brand data, navigation, content
│   └── supabase/
│       ├── client.ts             # Supabase client initialization
│       └── queries.ts            # Database query functions
├── types/
│   └── database.ts               # TypeScript types for database
├── database/
│   └── schema.sql                # Supabase PostgreSQL schema
├── public/                       # Static assets
└── .env.example                  # Environment variables template
```

## Quick Start

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd livingstone-web

# Install dependencies
npm install

# Create .env.local from template
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# (Optional) AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
AWS_S3_REGION=us-east-1
```

### 3. Setup Supabase Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and keys from Settings > API
3. Run the schema:
   - Open Supabase SQL Editor
   - Paste contents of `database/schema.sql`
   - Execute the entire script

### 4. Local Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### 5. Build for Production

```bash
npm run build
npm run start
```

## Key Features

### Marketing Website
- **Homepage**: Hero, frameworks showcase, companies ecosystem
- **About**: Philosophy, core pillars, areas of focus
- **Frameworks**: Searchable catalog of signature models
- **Articles**: Blog with category filtering
- **Companies**: Ecosystem overview (7 mission-driven organizations)
- **Resources**: Tools, templates, guides
- **Community**: Member benefits and connection opportunities
- **Contact**: Contact form with subject selection

### Dreamscourt Application
- **Dream Journal**: Record dreams with text or voice
- **AI Interpretation**: GPT-4 powered analysis of dreams
- **Prayer Journal**: Track prayers with status updates
- **Daily Reflections**: Guided reflection prompts
- **Analytics Dashboard**: Track streaks, insights, patterns
- **Personal Library**: Save frameworks and resources

## Design System

### Colors
- **Primary**: Deep Midnight Blue (#0a0a14) + Gold accents (#d4af37)
- **Secondary**: Charcoal (#2d2d2d), Stone Gray (#d1d5db)
- **Accents**: Rich Gold (#e6c75d), Bronze (#8b7355)

### Typography
- **Headings**: Lora (serif) - elegant, editorial
- **Body**: Inter (sans-serif) - modern, readable
- **Hierarchy**: Large headings, comfortable spacing

### Component API

```tsx
// Buttons
<Button variant="primary" | "secondary" | "tertiary" | "ghost" size="sm" | "md" | "lg" />

// Cards
<Card variant="default" | "elevated" | "bordered" padding="sm" | "md" | "lg" hover={true} />

// Sections
<Section padding="sm" | "md" | "lg" | "xl" background="white" | "light" | "dark" | "midnight-950" />

// Container (max-width layout)
<Container size="sm" | "md" | "lg" | "xl" />

// Badges
<Badge variant="default" | "primary" | "secondary" />
```

## Database Schema

### Core Tables
- **users**: User profiles (extends Supabase auth)
- **dreams**: Dream journal entries
- **dream_interpretations**: AI-generated dream analysis
- **prayer_journal**: Prayer tracking with answered status
- **daily_reflections**: Daily reflection prompts and responses
- **dream_tags**: Custom tags for organization
- **user_analytics**: Metrics and streaks
- **saved_frameworks**: Bookmarked frameworks

### Features
- Row Level Security (RLS) enabled
- Automated timestamps (created_at, updated_at)
- Foreign key relationships
- Indexes for performance

## API Routes

### POST /api/newsletter
Subscribe to newsletter
```json
{ "email": "user@example.com" }
```

### POST /api/contact
Contact form submission
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "partnership",
  "message": "..."
}
```

### POST /api/dreams/interpret
Generate dream interpretation (requires OpenAI API key)
```json
{
  "dreamId": "uuid",
  "userId": "uuid",
  "dreamContent": "..."
}
```

## Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub repository

### Steps

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - All values from `.env.local`
3. Deploy:
   ```bash
   git push origin main
   ```

Vercel automatically builds and deploys on push.

## Authentication Setup

### Option 1: Clerk (Recommended)

```bash
npm install @clerk/nextjs
```

Update `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### Option 2: Supabase Auth

Already configured via Supabase client.

## Future Enhancements

- [ ] Voice recording and transcription for dreams
- [ ] Community features (shared insights, discussions)
- [ ] Advanced analytics and pattern detection
- [ ] Mobile app (React Native)
- [ ] Integration with prayer request platforms
- [ ] Video content and courses
- [ ] Payment/subscription system

## Contributing

Follow these guidelines:
- Use TypeScript for all new code
- Keep components small and reusable
- Follow the established design system
- Test before submitting PRs

## Support

For issues or questions:
1. Check documentation in `database/schema.sql` for schema details
2. Review component examples in relevant component files
3. Consult the master prompt for brand guidelines

## License

© 2024 Livingstone. All rights reserved.
