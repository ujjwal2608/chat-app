// import { createContext, ReactNode, useContext, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// export const AuthContext = createContext();

// // eslint-disable-next-line react-refresh/only-export-components
// export const useAuthContext = () => {
//   return useContext(AuthContext);
// };

// export const AuthContextProvider = async ({ children }: { children: ReactNode }) => {
//   const [authUser, setAuthUser] = useState(JSON.parse(await AsyncStorage.getItem('token')));

//   return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
// };

interface AuthContextType{
  authUser:any,
  setAuthUser:any,
}
import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext<AuthContextType|null>({authUser:null,setAuthUser:null});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setAuthUser(token || null);
      } catch (error) {
        console.error("Error loading auth user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthUser();
  });

  // Optionally, display a loading indicator until the token is loaded
  if (loading) {
    return null; // or <LoadingComponent /> if you have one
  }

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
