
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'student' | 'vendor' | null;

interface UserContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Load role from localStorage when user is authenticated
        if (session?.user) {
          const savedRole = localStorage.getItem('userRole') as UserRole;
          if (savedRole) {
            setRole(savedRole);
          }
        } else {
          setRole(null);
          localStorage.removeItem('userRole');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        const savedRole = localStorage.getItem('userRole') as UserRole;
        if (savedRole) {
          setRole(savedRole);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem('userRole', newRole);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setRole(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('nigerianWallet');
      localStorage.setItem('nigerianWallet', '5000');
      setShowAuthDialog(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      session,
      role,
      setRole: handleSetRole,
      logout,
      isAuthenticated: !!user,
      showAuthDialog,
      setShowAuthDialog,
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
