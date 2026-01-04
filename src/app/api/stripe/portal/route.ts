import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createBillingPortalSession } from '@/lib/stripe/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL));
    }

    // Get customer ID
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return NextResponse.redirect(new URL('/pricing', process.env.NEXT_PUBLIC_APP_URL));
    }

    // Create portal session
    const session = await createBillingPortalSession(subscription.stripe_customer_id);

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.redirect(new URL('/profile', process.env.NEXT_PUBLIC_APP_URL));
  }
}


