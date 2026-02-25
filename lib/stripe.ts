import Stripe from 'stripe';

// Server-side only — never import this in client components
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PRICE_IDS = {
  plusMonthly:  process.env.STRIPE_PRICE_PLUS_MONTHLY!,
  plusYearly:   process.env.STRIPE_PRICE_PLUS_YEARLY!,
  credits1:     process.env.STRIPE_PRICE_CREDITS_1!,
  credits5:     process.env.STRIPE_PRICE_CREDITS_5!,
  credits10:    process.env.STRIPE_PRICE_CREDITS_10!,
} as const;

// Map price ID → credits granted (for one-time purchases)
export const CREDITS_BY_PRICE: Record<string, number> = {
  [process.env.STRIPE_PRICE_CREDITS_1!]:  1,
  [process.env.STRIPE_PRICE_CREDITS_5!]:  5,
  [process.env.STRIPE_PRICE_CREDITS_10!]: 10,
};
