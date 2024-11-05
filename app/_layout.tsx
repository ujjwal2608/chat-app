import { ReactNode } from 'react';
import '../global.css';
import { AuthContextProvider } from './context/AuthContext';
import { SocketContextProvider } from './context/SocketContext';
import { Stack } from 'expo-router';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContextProvider>
      <SocketContextProvider>{children}</SocketContextProvider>
    </AuthContextProvider>
  );
};
export default function Layout() {
  return (
    <MainLayout>
      <Stack />
    </MainLayout>
  );
}
