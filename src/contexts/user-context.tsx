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

// Maximum time to wait for auth (5 seconds - reduced for faster fallback)
const MAX_AUTH_WAIT = 5000;

// Check if Supabase auth storage is corrupted
function isAuthStorageCorrupted(): boolean {
  try {
    // Check for Supabase auth keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-')) {
        const value = localStorage.getItem(key);
        if (value) {
          // Try to parse - if it fails, storage is corrupted
          try {
            JSON.parse(value);
          } catch {
            console.error('Corrupted auth storage detected:', key);
            return true;
          }
        }
      }
    }
    return false;
  } catch {
    return true;
  }
}

// Clear all Supabase auth storage
function clearAuthStorage(): void {
  console.log('Clearing Supabase auth storage...');
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('sb-')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log('Removed:', key);
  });
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const isInitialized = useRef(false);
  const loadingRef = useRef(true); // Track loading state with ref for timeout callback
  const hasFetchedData = useRef(false); // Prevent duplicate data fetches

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    console.log('Fetching profile for:', userId);
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }
      console.log('Profile fetched successfully');
      return data as Profile;
    } catch (error) {
      console.error('Profile fetch exception:', error);
      return null;
    }
  }, []);

  const fetchSubscription = useCallback(async (userId: string): Promise<Subscription | null> => {
    console.log('Fetching subscription for:', userId);
    try {
      const supabase = getSupabaseClient();
      // Use maybeSingle() instead of single() to avoid errors when no subscription exists
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        // Silently handle all subscription errors - user is just on free plan
        console.log('Subscription: none (user is on free plan)');
        return null;
      }
      console.log('Subscription:', data ? 'premium' : 'free');
      return data as Subscription | null;
    } catch {
      // Silently fail - user is on free plan
      console.log('Subscription: none');
      return null;
    }
  }, []);

  const fetchUserData = useCallback(async (userId: string, force: boolean = false) => {
    // Prevent duplicate fetches unless forced
    if (hasFetchedData.current && !force) {
      console.log('Skipping duplicate fetch');
      return;
    }
    hasFetchedData.current = true;
    
    console.log('Fetching user data...');
    try {
      const [profileData, subscriptionData] = await Promise.all([
        fetchProfile(userId),
        fetchSubscription(userId),
      ]);
      setProfile(profileData);
      setSubscription(subscriptionData);
      console.log('User data fetch complete');
    } catch (error) {
      console.error('User data fetch error:', error);
    }
  }, [fetchProfile, fetchSubscription]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchUserData(user.id, true); // Force refresh
  }, [user, fetchUserData]);

  const clearUserData = useCallback(() => {
    console.log('Clearing user data');
    setUser(null);
    setProfile(null);
    setSubscription(null);
    setAuthError(null);
    hasFetchedData.current = false;
  }, []);

  const finishLoading = useCallback(() => {
    console.log('Finishing loading');
    loadingRef.current = false;
    setIsLoading(false);
  }, []);

  // Handle auth state changes
  const handleAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    console.log('Auth event:', event, session?.user?.email || 'no user');
    
    switch (event) {
      case 'INITIAL_SESSION':
        // Skip if we already initialized manually
        if (!loadingRef.current) {
          console.log('Skipping INITIAL_SESSION - already initialized');
          return;
        }
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
        finishLoading();
        break;
        
      case 'SIGNED_IN':
      case 'TOKEN_REFRESHED':
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
        finishLoading();
        break;
        
      case 'SIGNED_OUT':
        clearUserData();
        finishLoading();
        break;
        
      case 'USER_UPDATED':
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id, true); // Force refresh on user update
        }
        break;
        
      default:
        break;
    }
  }, [fetchUserData, clearUserData, finishLoading]);

  useEffect(() => {
    if (isInitialized.current) {
      console.log('Already initialized, skipping');
      return;
    }
    isInitialized.current = true;
    console.log('Initializing auth...');

    // Check for corrupted storage first
    if (isAuthStorageCorrupted()) {
      console.log('Corrupted storage detected, clearing...');
      clearAuthStorage();
    }

    const supabase = getSupabaseClient();
    let isMounted = true;

    // Failsafe timeout
    const timeout = setTimeout(() => {
      if (loadingRef.current) {
        console.warn('Auth timeout - forcing completion');
        finishLoading();
      }
    }, MAX_AUTH_WAIT);

    const initializeAuth = async () => {
      console.log('Getting session...');
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Session result:', session?.user?.email || 'no session', sessionError?.message || 'no error');

        if (!isMounted) {
          console.log('Component unmounted, aborting');
          return;
        }

        if (sessionError) {
          console.error('Session error, clearing storage');
          clearAuthStorage();
          finishLoading();
          return;
        }

        if (!session?.user) {
          console.log('No session, finishing');
          finishLoading();
          return;
        }

        // Validate session
        console.log('Validating session with getUser...');
        const { data: { user: validatedUser }, error: userError } = await supabase.auth.getUser();
        console.log('Validation result:', validatedUser?.email || 'no user', userError?.message || 'no error');

        if (!isMounted) return;

        if (userError || !validatedUser) {
          console.warn('Session invalid, signing out');
          clearAuthStorage();
          await supabase.auth.signOut().catch(() => {});
          clearUserData();
          finishLoading();
          return;
        }

        console.log('Session valid, setting user');
        setUser(validatedUser);
        await fetchUserData(validatedUser.id);
        finishLoading();
        
      } catch (error) {
        console.error('Init error:', error);
        clearAuthStorage();
        if (isMounted) {
          finishLoading();
        }
      }
    };

    // Set up listener first
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Then initialize
    initializeAuth();

    return () => {
      console.log('Cleanup');
      isMounted = false;
      clearTimeout(timeout);
      authSubscription.unsubscribe();
    };
  }, [handleAuthChange, fetchUserData, clearUserData, finishLoading]);

  const isPremium = subscription?.status === 'active' || subscription?.status === 'trialing';

  // Nuclear reset function - available globally for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as Window & { resetAuth?: () => void }).resetAuth = () => {
        console.log('Nuclear reset triggered');
        clearAuthStorage();
        window.location.reload();
      };
      console.log('Debug: call window.resetAuth() to reset auth');
    }
  }, []);

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
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-amber-600/90 text-white px-4 py-2 rounded-lg shadow-lg">
          <span className="text-sm">{authError}</span>
          <button 
            onClick={() => {
              clearAuthStorage();
              window.location.reload();
            }} 
            className="ml-2 underline text-sm"
          >
            Reset
          </button>
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
