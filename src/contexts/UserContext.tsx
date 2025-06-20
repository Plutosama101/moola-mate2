
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/components/NigerianWallet';

export type UserRole = 'student' | 'vendor' | null;

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface UserContextType {
  user: User | null;
  role: UserRole;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    const savedUser = storage.getItem('user');
    const savedRole = storage.getItem('userRole');
    if (savedUser && savedRole) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.email) {
          setUser(parsedUser);
          setRole(savedRole as UserRole);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      storage.setItem('user', JSON.stringify(newUser));
      setRole(newUser.role);
      storage.setItem('userRole', newUser.role || '');
    }
  };

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    storage.setItem('userRole', newRole || '');
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      storage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    storage.setItem('user', '');
    storage.setItem('userRole', '');
    storage.setItem('nigerianWallet', '5000');
    setShowAuthDialog(false);
  };

  return (
    <UserContext.Provider value={{
      user,
      role,
      setUser: handleSetUser,
      setRole: handleSetRole,
      logout,
      isAuthenticated: !!user && !!user.email,
      showAuthDialog,
      setShowAuthDialog
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
