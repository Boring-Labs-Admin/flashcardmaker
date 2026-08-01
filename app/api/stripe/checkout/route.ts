import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { stripe, PRICE_IDS } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// All price IDs live server-side — client only passes a productKey string
const PRODUCT_MAP = {
  plus_monthly: { priceId: PRICE_IDS.plusMonthly },
  plus_yearly:  { priceId: PRICE_IDS.plusYearly },
} as const;

export type ProductKey = keyof typeof PRODUCT_MAP;

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const userId = session.user.id;
  const email = session.user.email!;

  let productKey: string;
  try {
    const body = await request.json();
    productKey = body.productKey;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const product = PRODUCT_MAP[productKey as ProductKey];
  if (!product) {
    return NextResponse.json({ error: 'Unknown product.' }, { status: 400 });
  }

  // Look up or create a Stripe customer linked to this user
  const { data: planData } = await supabaseAdmin
    .from('user_plans')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  let customerId: string | undefined = planData?.stripe_customer_id ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { user_id: userId },
    });
    customerId = customer.id;

    await supabaseAdmin
      .from('user_plans')
      .update({ stripe_customer_id: customerId })
      .eq('user_id', userId);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://flashcardmaker.co.uk';

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: product.priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?payment=success`,
    cancel_url: `${baseUrl}/dashboard`,
    client_reference_id: userId,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
