import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  authUser: { token: string | null; userId: string | null } | null;
  setAuthUser: React.Dispatch<
    React.SetStateAction<{ token: string | null; userId: string | null } | null>
  >;
}

// Initialize AuthContext with a default value
export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<{ token: string | null; userId: string | null } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        // Set authUser only if both values are non-null
        if (token && userId) {
          setAuthUser({ token, userId });
        }
      } catch (error) {
        console.error('Error loading auth user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return null; // or a loading component
  }

  return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};
