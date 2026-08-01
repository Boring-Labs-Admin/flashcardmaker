import Stripe from 'stripe';

// Server-side only — never import this in client components
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PRICE_IDS = {
  plusMonthly: process.env.STRIPE_PRICE_PLUS_MONTHLY!,
  plusYearly:  process.env.STRIPE_PRICE_PLUS_YEARLY!,
} as const;
