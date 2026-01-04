'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Profile, Subscription, UserContextType } from '@/types';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Use ref to track if we've initialized
  const isInitialized = useRef(false);
  const fetchInProgress = useRef(false);
  
  // Get singleton client
  const supabase = getSupabaseClient();

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
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
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, [supabase]);

  const fetchSubscription = useCallback(async (userId: string): Promise<Subscription | null> => {
    try {
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
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }, [supabase]);

  const fetchUserData = useCallback(async (userId: string) => {
    // Prevent duplicate fetches
    if (fetchInProgress.current) {
      return;
    }
    
    fetchInProgress.current = true;
    
    try {
      const [profileData, subscriptionData] = await Promise.all([
        fetchProfile(userId),
        fetchSubscription(userId),
      ]);
      setProfile(profileData);
      setSubscription(subscriptionData);
      setAuthError(null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthError('Failed to load user data');
    } finally {
      fetchInProgress.current = false;
    }
  }, [fetchProfile, fetchSubscription]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchUserData(user.id);
  }, [user, fetchUserData]);

  // Clear all user data
  const clearUserData = useCallback(() => {
    setUser(null);
    setProfile(null);
    setSubscription(null);
    setAuthError(null);
  }, []);

  // Handle auth state changes
  const handleAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    console.log('Auth state change:', event);
    
    switch (event) {
      case 'INITIAL_SESSION':
      case 'SIGNED_IN':
      case 'TOKEN_REFRESHED':
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
        break;
        
      case 'SIGNED_OUT':
        clearUserData();
        break;
        
      case 'USER_UPDATED':
        if (session?.user) {
          setUser(session.user);
          // Refresh profile data when user is updated
          await fetchUserData(session.user.id);
        }
        break;
        
      case 'PASSWORD_RECOVERY':
        // Don't do anything special for password recovery
        break;
    }
  }, [fetchUserData, clearUserData]);

  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // First, try to get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError) {
          console.error('Session error:', sessionError);
          setAuthError('Failed to restore session');
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          // Validate the session by checking with getUser
          const { data: { user: validatedUser }, error: userError } = await supabase.auth.getUser();

          if (!isMounted) return;

          if (userError || !validatedUser) {
            // Session is invalid/expired - clear it
            console.warn('Session invalid, signing out');
            await supabase.auth.signOut();
            clearUserData();
            setIsLoading(false);
            return;
          }

          // Session is valid, set user and fetch data
          setUser(validatedUser);
          await fetchUserData(validatedUser.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setAuthError('Authentication error. Please refresh the page.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      isMounted = false;
      authSubscription.unsubscribe();
    };
  }, [supabase, fetchUserData, clearUserData, handleAuthChange]);

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
      {authError && !isLoading && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span>{authError}</span>
            <button 
              onClick={() => window.location.reload()} 
              className="underline hover:no-underline"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
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
