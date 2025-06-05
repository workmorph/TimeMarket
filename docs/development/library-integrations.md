# Library Integrations Documentation

This document describes the library integrations implemented in the TimeMarket project.

## 🚨 Issue #021: Sentry Error Monitoring

### Overview
Sentry has been integrated for comprehensive error monitoring and performance tracking.

### Implementation
- **Configuration Files**: 
  - `sentry.client.config.js` - Client-side configuration
  - `sentry.server.config.js` - Server-side configuration
  - `sentry.edge.config.js` - Edge runtime configuration
- **Next.js Integration**: Modified `next.config.ts` to wrap with Sentry
- **Error Page**: Updated `src/app/error.tsx` to report errors to Sentry

### Environment Variables
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

### Features
- Automatic error capture
- Performance monitoring
- Release tracking
- Session replay (10% sample rate, 100% on errors)
- Source map upload for better stack traces

## 📧 Issue #022: Resend Email Service

### Overview
Resend has been integrated for modern, reliable email delivery.

### Implementation
- **Email Client**: `src/lib/email/resend-client.ts`
- **Email Templates**: `emails/` directory with React Email components
- **Notification API**: `src/app/api/notifications/route.ts`

### Email Templates
- `emails/auction-bid-notification.tsx` - Beautiful HTML email for bid notifications

### Environment Variables
```env
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=noreply@timebid.com
```

### Features
- React-based email templates
- Batch email sending
- High deliverability
- Unsubscribe links
- Beautiful HTML emails with Tailwind styling

## 🔍 Issue #023: Algolia Search

### Overview
Algolia has been integrated for lightning-fast search with typo tolerance and faceted filtering.

### Implementation
- **Search Client**: `src/lib/search/algolia-client.ts`
- **Search UI**: `src/components/search/AlgoliaSearch.tsx`
- **Data Sync**: `src/app/api/algolia-sync/route.ts`
- **Search Page**: `src/app/search/page.tsx`

### Environment Variables
```env
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_algolia_search_key
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_key
SUPABASE_WEBHOOK_SECRET=your_webhook_secret # Optional
```

### Features
- Instant search with <50ms response time
- Typo tolerance
- Faceted search (category, price range, status)
- Real-time data sync via Supabase webhooks
- Beautiful search UI with React InstantSearch
- Geolocation search support

### Indexes
1. **auctions** - All auction listings
   - Searchable: title, description, seller_name, category
   - Facets: category, status, price_range, end_time
   - Custom ranking: bid_count, current_price

2. **experts** - Expert profiles
   - Searchable: name, expertise, bio, skills
   - Facets: expertise, skills, hourly_rate_range, rating
   - Custom ranking: rating, completed_sessions

## Installation

To install all dependencies for these integrations, run:

```bash
chmod +x scripts/add-integration-dependencies.sh
./scripts/add-integration-dependencies.sh
```

## Next Steps

After setting up the environment variables:

1. **Sentry**: 
   - Create a project at https://sentry.io
   - Configure alerts and integrations
   - Test error reporting

2. **Resend**: 
   - Sign up at https://resend.com
   - Verify your domain
   - Create more email templates as needed

3. **Algolia**: 
   - Create an account at https://www.algolia.com
   - Set up Supabase webhooks for real-time sync
   - Run initial data sync: `GET /api/algolia-sync`

## Troubleshooting

### Sentry not capturing errors
- Ensure environment variables are set correctly
- Check that the DSN is valid
- Verify the integration in Next.js config

### Emails not sending
- Verify Resend API key
- Check sender email is verified
- Review Resend dashboard for errors

### Search not working
- Ensure Algolia credentials are correct
- Run manual sync to populate initial data
- Check browser console for errors