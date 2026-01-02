import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
}

// For backwards compatibility
export const stripe = {
  get checkout() {
    return getStripeServer().checkout;
  },
  get subscriptions() {
    return getStripeServer().subscriptions;
  },
  get customers() {
    return getStripeServer().customers;
  },
  get billingPortal() {
    return getStripeServer().billingPortal;
  },
  get webhooks() {
    return getStripeServer().webhooks;
  },
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
) {
  const session = await getStripeServer().checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createCustomer(email: string, userId: string) {
  const customer = await getStripeServer().customers.create({
    email,
    metadata: {
      userId,
    },
  });

  return customer;
}

export async function createBillingPortalSession(customerId: string) {
  const session = await getStripeServer().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
  });

  return session;
}
