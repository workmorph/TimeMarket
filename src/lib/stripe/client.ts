import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripe = (): Stripe | null => {
  if (process.env.STRIPE_ACCOUNT_ACTIVE === 'false') {
    console.warn('Stripe account is not active. STRIPE_ACCOUNT_ACTIVE is set to false.');
    return null;
  }

  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key is not configured. Please set STRIPE_SECRET_KEY environment variable.');
      return null;
    }
    // apiVersion の指定を一旦削除
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return stripe;
}; 