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

// Maximum time to wait for auth initialization (10 seconds)
const MAX_AUTH_WAIT = 10000;

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Use refs to avoid dependency issues
  const isInitialized = useRef(false);
  const supabaseRef = useRef(getSupabaseClient());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Failsafe: Always stop loading after MAX_AUTH_WAIT
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth initialization timed out, forcing completion');
        setIsLoading(false);
        setAuthError('Loading took too long. Please refresh if you experience issues.');
      }
    }, MAX_AUTH_WAIT);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading]);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabaseRef.current
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
  }, []);

  const fetchSubscription = useCallback(async (userId: string): Promise<Subscription | null> => {
    try {
      const { data, error } = await supabaseRef.current
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
  }, []);

  const fetchUserData = useCallback(async (userId: string) => {
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
      // Don't set auth error for data fetch failures - user can still use the app
    }
  }, [fetchProfile, fetchSubscription]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchUserData(user.id);
  }, [user, fetchUserData]);

  const clearUserData = useCallback(() => {
    setUser(null);
    setProfile(null);
    setSubscription(null);
    setAuthError(null);
  }, []);

  // Handle auth state changes
  const handleAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    console.log('Auth state change:', event);
    
    // Clear the timeout since we got an auth event
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    switch (event) {
      case 'INITIAL_SESSION':
        // This is handled by our initialization, but also set loading false here
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
        setIsLoading(false);
        break;
        
      case 'SIGNED_IN':
      case 'TOKEN_REFRESHED':
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
        setIsLoading(false);
        break;
        
      case 'SIGNED_OUT':
        clearUserData();
        setIsLoading(false);
        break;
        
      case 'USER_UPDATED':
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
        break;
        
      case 'PASSWORD_RECOVERY':
        break;
    }
  }, [fetchUserData, clearUserData]);

  useEffect(() => {
    // Prevent double initialization
    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    const supabase = supabaseRef.current;
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // First, try to get the session from storage
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError) {
          console.error('Session error:', sessionError);
          // Clear potentially corrupted session data
          try {
            await supabase.auth.signOut();
          } catch {
            // Ignore signout errors
          }
          setIsLoading(false);
          return;
        }

        if (!session?.user) {
          // No session, that's fine - user is not logged in
          setIsLoading(false);
          return;
        }

        // We have a session, validate it with the server
        const { data: { user: validatedUser }, error: userError } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (userError) {
          console.warn('Session validation failed:', userError.message);
          // Session is invalid - sign out and clear
          try {
            await supabase.auth.signOut();
          } catch {
            // Ignore signout errors
          }
          clearUserData();
          setIsLoading(false);
          return;
        }

        if (!validatedUser) {
          // No user returned - session is invalid
          try {
            await supabase.auth.signOut();
          } catch {
            // Ignore signout errors
          }
          clearUserData();
          setIsLoading(false);
          return;
        }

        // Session is valid - set user and fetch data
        setUser(validatedUser);
        await fetchUserData(validatedUser.id);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          // Try to clear any corrupted state
          try {
            await supabase.auth.signOut();
          } catch {
            // Ignore signout errors
          }
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener BEFORE initializing
    // This ensures we catch any events fired during initialization
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Now initialize
    initializeAuth();

    return () => {
      isMounted = false;
      authSubscription.unsubscribe();
    };
  }, [handleAuthChange, fetchUserData, clearUserData]);

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
      {authError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-amber-600/90 text-white px-4 py-2 rounded-lg shadow-lg max-w-md text-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">{authError}</span>
            <button 
              onClick={() => {
                setAuthError(null);
                window.location.reload();
              }} 
              className="underline hover:no-underline text-sm font-medium"
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
