import { NextResponse } from 'next/server';

type PresellQuestionId =
  | 'q1_brings_you_here'
  | 'q2_time_daily'
  | 'q3_severity'
  | 'q4_biggest_challenge'
  | 'q5_tried'
  | 'q6_did_it_help'
  | 'q7_why_not_work'
  | 'q8_fair_price'
  | 'q9_pay_pref'
  | 'q10_feedback';

type PresellAnswerValue = string | string[];

type WaitlistPayload = {
  email?: string;
  answers?: Record<PresellQuestionId, PresellAnswerValue>;
  otherText?: Partial<Record<PresellQuestionId, string>>;
  feedback?: string;
  source?: string;
  website?: string; // honeypot
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clampString(value: string, maxLen: number) {
  const v = value.trim();
  if (v.length <= maxLen) return v;
  return v.slice(0, maxLen);
}

function toStringValue(value: PresellAnswerValue | undefined) {
  if (!value) return '';
  if (Array.isArray(value)) return value.join(', ');
  return value;
}

function isLikelyLoopsListId(value: string) {
  // Loops mailing list IDs are typically short IDs (no spaces). If a user accidentally
  // pastes a name or something long, Loops can reject the payload.
  return /^[a-zA-Z0-9_-]{1,64}$/.test(value);
}

export async function POST(request: Request) {
  const loopsApiKey = process.env.LOOPS_API_KEY;
  const loopsWaitlistListId = process.env.LOOPS_WAITLIST_MAILING_LIST_ID;

  if (!loopsApiKey) {
    return NextResponse.json(
      { error: 'Waitlist is temporarily unavailable. Please try again later.' },
      { status: 500 }
    );
  }

  let body: WaitlistPayload;
  try {
    body = (await request.json()) as WaitlistPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot: treat as success but don’t forward to Loops
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const email = (body.email || '').trim();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const answers =
    body.answers || ({} as Record<PresellQuestionId, PresellAnswerValue>);
  const otherText = body.otherText || {};
  const feedback = (body.feedback || '').trim();

  // Defensive limits for third-party API constraints.
  // Keep values comfortably under common 255-char property limits.
  const MAX_PROP_LEN = 200;

  const customProperties = {
    ps_q1: clampString(
      toStringValue(answers.q1_brings_you_here),
      MAX_PROP_LEN
    ),
    ps_q1_other: clampString(otherText.q1_brings_you_here || '', MAX_PROP_LEN),
    ps_q2: clampString(
      toStringValue(answers.q2_time_daily),
      MAX_PROP_LEN
    ),
    ps_q3: clampString(
      toStringValue(answers.q3_severity),
      MAX_PROP_LEN
    ),
    ps_q4: clampString(
      toStringValue(answers.q4_biggest_challenge),
      MAX_PROP_LEN
    ),
    ps_q4_other: clampString(otherText.q4_biggest_challenge || '', MAX_PROP_LEN),
    ps_q5: clampString(toStringValue(answers.q5_tried), MAX_PROP_LEN),
    ps_q5_other: clampString(otherText.q5_tried || '', MAX_PROP_LEN),
    ps_q6: clampString(
      toStringValue(answers.q6_did_it_help),
      MAX_PROP_LEN
    ),
    ps_q7: clampString(
      toStringValue(answers.q7_why_not_work),
      MAX_PROP_LEN
    ),
    ps_q7_other: clampString(otherText.q7_why_not_work || '', MAX_PROP_LEN),
    ps_q8: clampString(
      toStringValue(answers.q8_fair_price),
      MAX_PROP_LEN
    ),
    ps_q9: clampString(
      toStringValue(answers.q9_pay_pref),
      MAX_PROP_LEN
    ),
    ps_q10_feedback: clampString(feedback, MAX_PROP_LEN),
    ps_reward: '2_months_free',
    ps_source: clampString(body.source || 'presell_quiz', 60),
  };

  const payload: Record<string, unknown> = {
    email,
    source: 'Presell Quiz',
    customProperties,
  };

  const listId = (loopsWaitlistListId || '').trim();
  if (listId && isLikelyLoopsListId(listId)) {
    // Loops expects an object of { [listId]: true|false|null }
    payload.mailingLists = { [listId]: true };
  }

  const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${loopsApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // Loops may return 200 with a JSON body indicating failure (e.g., duplicate email).
  // So we always read the body and interpret it defensively.
  let loopsBodyText = '';
  try {
    loopsBodyText = await res.text();
  } catch {
    // ignore
  }

  let loopsMessage = '';
  let loopsSuccess: boolean | undefined = undefined;
  try {
    const trimmed = loopsBodyText.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      const parsed = JSON.parse(trimmed) as { success?: boolean; message?: string };
      loopsSuccess = parsed?.success;
      loopsMessage = parsed?.message || '';
    }
  } catch {
    // ignore
  }

  const msgLower = (loopsMessage || loopsBodyText || '').toLowerCase();
  const isDuplicate =
    res.status === 409 ||
    (msgLower.includes('already') && msgLower.includes('audience')) ||
    msgLower.includes('already on the waitlist');

  if (isDuplicate) {
    return NextResponse.json(
      { ok: true, alreadyOnWaitlist: true },
      { status: 200 }
    );
  }

  // If Loops says success:false (even with 200), treat it as an error for the client.
  if (loopsSuccess === false) {
    return NextResponse.json(
      {
        error:
          loopsMessage ||
          'Something went wrong. Please try again.',
      },
      { status: 502 }
    );
  }

  if (!res.ok) {
    let message = 'Loops request failed';
    try {
      if (loopsBodyText) message = loopsBodyText;
      if (loopsMessage) message = loopsMessage;
    } catch {
      // ignore
    }

    return NextResponse.json(
      {
        error:
          message && message !== 'Loops request failed'
            ? message
            : 'Something went wrong. Please try again.',
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}


