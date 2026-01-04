'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useUser } from '@/contexts/user-context';
import { Card, Button, Input } from '@/components/ui';

export default function ProfilePage() {
  const { user, profile, subscription, isPremium, isLoading, refreshProfile } = useUser();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = useMemo(() => getSupabaseClient(), []);
  const router = useRouter();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="w-12 h-12 rounded-full bg-accent/30" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary font-[family-name:var(--font-dm-serif)]">
          Profile
        </h1>
        <p className="text-text-secondary mt-1">
          Manage your account settings
        </p>
      </motion.div>

      {/* Profile info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <Card>
          <h2 className="text-lg font-medium text-text-primary mb-4">
            Account Information
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <p className="text-text-primary">{user?.email}</p>
              <p className="text-text-muted text-sm mt-1">
                Email cannot be changed
              </p>
            </div>

            {message && (
              <p
                className={`text-sm ${
                  message.type === 'success' ? 'text-success' : 'text-error'
                }`}
              >
                {message.text}
              </p>
            )}

            <Button type="submit" isLoading={isSaving}>
              Save Changes
            </Button>
          </form>
        </Card>

        {/* Subscription */}
        <Card>
          <h2 className="text-lg font-medium text-text-primary mb-4">
            Subscription
          </h2>

          {isPremium ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text-primary">
                    Premium ({subscription?.plan_type})
                  </p>
                  <p className="text-sm text-text-secondary">
                    Renews on {formatDate(subscription?.current_period_end || null)}
                  </p>
                </div>
              </div>

              {subscription?.cancel_at_period_end && (
                <p className="text-warning text-sm">
                  Your subscription will cancel at the end of the current billing period
                </p>
              )}

              <Link href="/api/stripe/portal">
                <Button variant="secondary">Manage Subscription</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-text-secondary">
                You&apos;re on the free plan. Upgrade to unlock all programs and features.
              </p>
              <Link href="/pricing">
                <Button>Upgrade to Premium</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Preferences */}
        {profile?.quiz_completed && (
          <Card>
            <h2 className="text-lg font-medium text-text-primary mb-4">
              Your Preferences
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Experience Level</span>
                <span className="text-text-primary capitalize">
                  {profile.experience_level}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Preferred Duration</span>
                <span className="text-text-primary">
                  {profile.preferred_duration} minutes
                </span>
              </div>
              {profile.goals && profile.goals.length > 0 && (
                <div>
                  <span className="text-text-secondary block mb-2">Goals</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.goals.map((goal) => (
                      <span
                        key={goal}
                        className="px-3 py-1 bg-bg-tertiary text-text-primary rounded-full text-xs"
                      >
                        {goal.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link href="/onboarding">
                <Button variant="ghost" size="sm">
                  Retake Quiz
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Sign out */}
        <Card>
          <h2 className="text-lg font-medium text-text-primary mb-4">
            Account Actions
          </h2>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}


