
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
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
          } else {
            // If no saved role, try to get from user metadata
            const metadataRole = session.user.user_metadata?.role as UserRole;
            if (metadataRole) {
              setRole(metadataRole);
              localStorage.setItem('userRole', metadataRole);
            }
          }
        } else {
          setRole(null);
          localStorage.removeItem('userRole');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        const savedRole = localStorage.getItem('userRole') as UserRole;
        if (savedRole) {
          setRole(savedRole);
        } else {
          // If no saved role, try to get from user metadata
          const metadataRole = session.user.user_metadata?.role as UserRole;
          if (metadataRole) {
            setRole(metadataRole);
            localStorage.setItem('userRole', metadataRole);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSetRole = (newRole: UserRole) => {
    console.log('Setting role:', newRole);
    setRole(newRole);
    if (newRole) {
      localStorage.setItem('userRole', newRole);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setRole(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('nigerianWallet');
      localStorage.setItem('nigerianWallet', '5000');
      setShowAuthDialog(false);
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of SnappyEats",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout Error",
        description: "There was an error logging you out",
        variant: "destructive",
      });
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
