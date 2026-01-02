'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile, Subscription, UserContextType } from '@/types';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  }, [supabase]);

  const fetchSubscription = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error);
      return null;
    }
    return data as Subscription | null;
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const [profileData, subscriptionData] = await Promise.all([
      fetchProfile(user.id),
      fetchSubscription(user.id),
    ]);
    setProfile(profileData);
    setSubscription(subscriptionData);
  }, [user, fetchProfile, fetchSubscription]);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          const [profileData, subscriptionData] = await Promise.all([
            fetchProfile(session.user.id),
            fetchSubscription(session.user.id),
          ]);
          setProfile(profileData);
          setSubscription(subscriptionData);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const [profileData, subscriptionData] = await Promise.all([
          fetchProfile(session.user.id),
          fetchSubscription(session.user.id),
        ]);
        setProfile(profileData);
        setSubscription(subscriptionData);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setSubscription(null);
      }
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, [supabase, fetchProfile, fetchSubscription]);

  const isPremium =
    subscription?.status === 'active' || subscription?.status === 'trialing';

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        subscription,
        isLoading,
        isPremium,
        refreshProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

