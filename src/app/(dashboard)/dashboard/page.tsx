'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/user-context';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Program, UserProgram, Session } from '@/types';

interface DashboardStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  activeProgram: (UserProgram & { program: Program }) | null;
}

export default function DashboardPage() {
  const { profile, isLoading: userLoading, isPremium } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      if (!profile) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch sessions for stats
        const { data: sessions } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', profile.id)
          .order('completed_at', { ascending: false });

        // Fetch active program
        const { data: activePrograms } = await supabase
          .from('user_programs')
          .select('*, program:programs(*)')
          .eq('user_id', profile.id)
          .eq('is_active', true)
          .limit(1);

        const totalSessions = sessions?.length || 0;
        const totalMinutes = Math.round(
          (sessions?.reduce((acc: number, s: { duration_seconds: number }) => acc + s.duration_seconds, 0) || 0) / 60
        );

        // Calculate streak (simplified)
        let currentStreak = 0;
        if (sessions && sessions.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const sessionDates = sessions.map((s: { completed_at: string }) => {
            const d = new Date(s.completed_at);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
          });

          const uniqueDates = ([...new Set(sessionDates)] as number[]).sort((a, b) => b - a);
          
          for (let i = 0; i < uniqueDates.length; i++) {
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            expectedDate.setHours(0, 0, 0, 0);
            
            if (uniqueDates[i] === expectedDate.getTime()) {
              currentStreak++;
            } else {
              break;
            }
          }
        }

        setStats({
          totalSessions,
          totalMinutes,
          currentStreak,
          activeProgram: activePrograms?.[0] as (UserProgram & { program: Program }) || null,
        });

        setRecentSessions(sessions?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    // Only fetch when user loading is complete
    if (!userLoading) {
      fetchDashboardData();
    }
  }, [profile, userLoading, supabase]);

  if (userLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="w-12 h-12 rounded-full bg-accent/30" />
        </div>
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary">
          {greeting()}, {profile?.full_name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-text-secondary mt-1">
          Ready for a moment of calm?
        </p>
      </motion.div>

      {/* Quick start section */}
      {stats?.activeProgram ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="elevated" className="bg-gradient-to-br from-accent/10 to-lavender/10">
            <CardHeader>
              <p className="text-sm text-text-secondary">Continue your program</p>
              <CardTitle className="text-xl">
                {stats.activeProgram.program.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary">
                    Day {stats.activeProgram.current_day} of{' '}
                    {stats.activeProgram.program.duration_days}
                  </p>
                  <div className="mt-2 w-48 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{
                        width: `${(stats.activeProgram.current_day / stats.activeProgram.program.duration_days) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <Link href={`/programs/${stats.activeProgram.program_id}`}>
                  <Button size="lg">Continue</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="elevated" className="bg-gradient-to-br from-accent/10 to-lavender/10">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  Start Your Journey
                </h2>
                <p className="text-text-secondary mt-1">
                  {profile?.quiz_completed
                    ? 'Choose a program to begin your relaxation practice'
                    : 'Take a quick quiz to find the perfect program for you'}
                </p>
              </div>
              <Link href={profile?.quiz_completed ? '/programs' : '/onboarding'}>
                <Button size="lg">
                  {profile?.quiz_completed ? 'Browse Programs' : 'Take Quiz'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <Card padding="md">
          <p className="text-text-muted text-sm">Sessions</p>
          <p className="text-2xl font-semibold text-text-primary mt-1">
            {stats?.totalSessions || 0}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-text-muted text-sm">Minutes</p>
          <p className="text-2xl font-semibold text-text-primary mt-1">
            {stats?.totalMinutes || 0}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-text-muted text-sm">Streak</p>
          <p className="text-2xl font-semibold text-text-primary mt-1">
            {stats?.currentStreak || 0} days
          </p>
        </Card>
        <Card padding="md">
          <p className="text-text-muted text-sm">Status</p>
          <p className="text-2xl font-semibold text-accent mt-1">
            {isPremium ? 'Premium' : 'Free'}
          </p>
        </Card>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Quick Sessions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card hoverable className="cursor-pointer">
            <Link href="/exercises/breathing/quick" className="block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">
                    2-Minute Calm
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Quick breathing exercise
                  </p>
                </div>
              </div>
            </Link>
          </Card>

          <Card hoverable className="cursor-pointer">
            <Link href="/exercises/pmr/quick" className="block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-lavender/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-lavender"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">
                    Shoulder Release
                  </h3>
                  <p className="text-sm text-text-secondary">
                    5-minute PMR session
                  </p>
                </div>
              </div>
            </Link>
          </Card>

          <Card hoverable className="cursor-pointer">
            <Link href="/exercises/meditation/quick" className="block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">
                    Mindful Moment
                  </h3>
                  <p className="text-sm text-text-secondary">
                    3-minute meditation
                  </p>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </motion.div>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Recent Sessions
          </h2>
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <Card key={session.id} padding="sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-primary">
                      {Math.round(session.duration_seconds / 60)} min session
                    </p>
                    <p className="text-sm text-text-muted">
                      {new Date(session.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                  {session.feedback_rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < session.feedback_rating!
                              ? 'text-warning'
                              : 'text-text-muted'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

