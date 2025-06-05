#!/bin/bash

# This script adds the necessary dependencies for the library integrations

echo "Adding dependencies for Sentry, Resend, and Algolia integrations..."

# Sentry dependencies
npm install @sentry/nextjs@latest

# Resend dependencies
npm install resend@latest
npm install @react-email/components@latest
npm install react-email@latest

# Algolia dependencies
npm install algoliasearch@latest
npm install react-instantsearch@latest
npm install react-instantsearch-nextjs@latest

echo "Dependencies added successfully!"
echo ""
echo "Remember to configure the following environment variables:"
echo "- NEXT_PUBLIC_SENTRY_DSN"
echo "- SENTRY_ORG"
echo "- SENTRY_PROJECT"
echo "- SENTRY_AUTH_TOKEN"
echo "- RESEND_API_KEY"
echo "- RESEND_FROM_EMAIL"
echo "- NEXT_PUBLIC_ALGOLIA_APP_ID"
echo "- NEXT_PUBLIC_ALGOLIA_SEARCH_KEY"
echo "- ALGOLIA_ADMIN_API_KEY"