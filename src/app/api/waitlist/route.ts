import { NextResponse } from 'next/server';
import type { WaitlistSubmission, LoopsContactProperties } from '@/types/quiz';

const LOOPS_API_URL = 'https://app.loops.so/api/v1/contacts/create';

export async function POST(request: Request) {
  try {
    const body: WaitlistSubmission = await request.json();

    // Validate email
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.LOOPS_API_KEY;
    if (!apiKey) {
      console.error('LOOPS_API_KEY not configured');
      return NextResponse.json(
        { success: false, message: 'Service temporarily unavailable' },
        { status: 500 }
      );
    }

    // Transform quiz answers to Loops contact properties
    const contactProperties: LoopsContactProperties = {
      email: body.email,
      source: 'presell_quiz',
      whatBringsYou: body.answers.whatBringsYou,
      whatBringsYouOther: body.answers.whatBringsYouOther,
      timeAvailable: body.answers.timeAvailable,
      lifeImpact: body.answers.lifeImpact,
      biggestChallenge: body.answers.biggestChallenge,
      biggestChallengeOther: body.answers.biggestChallengeOther,
      whatTried: body.answers.whatTried.join(', '),
      whatTriedOther: body.answers.whatTriedOther,
      didItHelp: body.answers.didItHelp,
      whyDidntWork: body.answers.whyDidntWork,
      whyDidntWorkOther: body.answers.whyDidntWorkOther,
      fairPrice: body.answers.fairPrice,
      paymentPreference: body.answers.paymentPreference,
    };

    // Send to Loops API
    const loopsResponse = await fetch(LOOPS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(contactProperties),
    });

    if (!loopsResponse.ok) {
      const errorData = await loopsResponse.text();
      console.error('Loops API error:', errorData);
      
      // Check if it's a duplicate email (Loops returns 409 for duplicates)
      if (loopsResponse.status === 409) {
        return NextResponse.json(
          { success: true, message: 'You are already on the waitlist!' },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { success: false, message: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Successfully joined the waitlist!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist submission error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
