import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { getStripeServer } from '@/lib/stripe/server';

// Lazy initialization for Supabase admin client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseAdminInstance: any = null;

async function getSupabaseAdmin() {
  if (!supabaseAdminInstance) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    }
    // Dynamic import to avoid module-level evaluation
    const { createClient } = await import('@supabase/supabase-js');
    supabaseAdminInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabaseAdminInstance;
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripeServer().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!subscriptionId) return;

  // Get subscription details - cast to any to handle API version differences
  const subscriptionData = await getStripeServer().subscriptions.retrieve(subscriptionId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = subscriptionData as any;

  // Update subscription in database
  const supabase = await getSupabaseAdmin();
  await supabase
    .from('subscriptions')
    .update({
      stripe_subscription_id: subscriptionId,
      status: mapSubscriptionStatus(sub.status),
      plan_type: sub.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 'yearly' : 'monthly',
      current_period_start: sub.current_period_start 
        ? new Date(sub.current_period_start * 1000).toISOString() 
        : null,
      current_period_end: sub.current_period_end 
        ? new Date(sub.current_period_end * 1000).toISOString() 
        : null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
    })
    .eq('stripe_customer_id', customerId);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = subscription as any;

  const supabase = await getSupabaseAdmin();
  await supabase
    .from('subscriptions')
    .update({
      stripe_subscription_id: sub.id,
      status: mapSubscriptionStatus(sub.status),
      current_period_start: sub.current_period_start 
        ? new Date(sub.current_period_start * 1000).toISOString() 
        : null,
      current_period_end: sub.current_period_end 
        ? new Date(sub.current_period_end * 1000).toISOString() 
        : null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
    })
    .eq('stripe_customer_id', customerId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const supabase = await getSupabaseAdmin();
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: false,
    })
    .eq('stripe_customer_id', customerId);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Just log for now - subscription update handles most of this
  console.log(`Payment succeeded for customer: ${customerId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const supabase = await getSupabaseAdmin();
  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
    })
    .eq('stripe_customer_id', customerId);
}

function mapSubscriptionStatus(
  status: string
): 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' {
  switch (status) {
    case 'active':
      return 'active';
    case 'canceled':
      return 'canceled';
    case 'past_due':
      return 'past_due';
    case 'trialing':
      return 'trialing';
    case 'incomplete':
    case 'incomplete_expired':
    case 'unpaid':
    case 'paused':
    default:
      return 'incomplete';
  }
}
