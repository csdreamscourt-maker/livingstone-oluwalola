# Livingstone Digital Ecosystem - Deployment Guide

## Overview

This guide walks through deploying the Livingstone brand website and Dreamscourt application to production on Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push code to a GitHub repo
3. **Supabase Project**: Database at [supabase.com](https://supabase.com)
4. **API Keys**: OpenAI, AWS S3 (optional), other services

## Deployment Steps

### Step 1: Prepare Code

```bash
# Ensure code is committed
git log --oneline -1

# Build locally to verify
npm run build

# All checks should pass
npm run lint
```

### Step 2: Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Authorize GitHub and select the repository
4. Create the project

### Step 3: Configure Environment Variables

In Vercel Dashboard > Project Settings > Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_KEY=<your_supabase_service_key>
OPENAI_API_KEY=<your_openai_api_key>
AWS_ACCESS_KEY_ID=<if using S3>
AWS_SECRET_ACCESS_KEY=<if using S3>
AWS_S3_BUCKET=<if using S3>
AWS_S3_REGION=us-east-1
NEXT_PUBLIC_APP_URL=https://<your-domain>.com
```

### Step 4: Setup Supabase Database

1. Go to your Supabase project
2. Open SQL Editor
3. Run the schema from `database/schema.sql`

### Step 5: Deploy

Option A: Automatic (Git push)
```bash
git push origin main
# Vercel automatically deploys on push
```

Option B: Manual Deploy
1. In Vercel Dashboard, click "Deploy"
2. Wait for build to complete
3. Check deployment logs for errors

### Step 6: Configure Domain

1. In Vercel > Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Post-Deployment Checklist

- [ ] Verify homepage loads correctly
- [ ] Test navigation between pages
- [ ] Confirm API routes work (/api/contact, /api/newsletter)
- [ ] Check mobile responsiveness
- [ ] Test form submissions
- [ ] Verify emails are sent (if email configured)
- [ ] Monitor error logs for issues

## Environment-Specific Configurations

### Staging (Optional)

Create a staging environment on Vercel:
```bash
# Create staging branch
git checkout -b staging
# Make staging-specific changes
git push origin staging
```

### Production

Main branch automatically deploys to production.

## Rollback Procedure

If deployment issues occur:

1. In Vercel > Deployments
2. Find the last working deployment
3. Click "Rollback" next to the deployment
4. Confirm

## Monitoring & Logs

### Vercel Analytics
- View performance metrics in Vercel Dashboard
- Monitor real user data

### Supabase Logs
- Check database logs in Supabase Dashboard
- Monitor connection issues

### Error Tracking
- Set up error monitoring (e.g., Sentry)
- Configure alerts for critical errors

## Performance Optimization

### Image Optimization
- Use Next.js Image component
- Vercel CDN automatically optimizes

### Database
- Add indexes to frequently queried columns
- Monitor slow queries in Supabase

### API Routes
- Use response caching where appropriate
- Implement request deduplication

## Security Checklist

- [ ] All sensitive keys in environment variables
- [ ] Database RLS policies enabled
- [ ] API routes have proper validation
- [ ] CORS properly configured
- [ ] SSL/HTTPS enabled (automatic with Vercel)
- [ ] Regular security updates for dependencies

```bash
npm audit
npm audit fix
```

## Scaling Considerations

As user base grows:

1. **Database**: Upgrade Supabase plan
2. **Storage**: Increase S3 capacity or enable versioning
3. **API**: Monitor rate limits and adjust
4. **Analytics**: Implement advanced analytics

## CI/CD Pipeline

Vercel automatically:
- Runs linting on each push
- Builds production bundle
- Tests deployment
- Previews changes on pull requests
- Deploys to production on merge

## Maintenance

### Regular Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update Next.js
npm install next@latest
```

### Database Backups
- Supabase automatically backs up daily
- Manual backup before major changes

### Monitoring
- Set up uptime monitoring
- Configure alerts for downtime

## Troubleshooting

### Build Fails
1. Check `npm run build` locally
2. Review Vercel build logs
3. Ensure all environment variables are set

### Database Connection Issues
1. Verify Supabase keys are correct
2. Check network policies in Supabase
3. Ensure database is not under maintenance

### Performance Issues
1. Check Vercel Analytics
2. Profile API routes
3. Optimize database queries

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Project Setup: See SETUP.md

## Going Live Checklist

- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] Emails configured and tested
- [ ] Custom domain pointing to Vercel
- [ ] SSL certificate active
- [ ] Analytics installed and working
- [ ] Error tracking configured
- [ ] Backups enabled
- [ ] Team access configured
- [ ] Documentation updated
- [ ] Emergency contact information shared
