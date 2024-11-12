import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuthContext } from './AuthContext';
import io, { Socket } from 'socket.io-client';
import { BASE_URL } from '../constants';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[]; // Adjust this type based on the structure of user data received
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketContextProvider');
  }
  return context;
};

interface SocketContextProviderProps {
  children: ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!socket && authUser) {
      const newSocket = io(BASE_URL, {
        query: {
          userId: authUser.userId,
        },
      });

      setSocket(newSocket);

      newSocket.on('getOnlineUsers', (users: string[]) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [authUser, socket]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>
  );
};
