import { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import { useAuthContext } from './AuthContext';
import io, { Socket } from 'socket.io-client';
import { BASE_URL } from '../constants';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startCall: (targetUserId: string) => void;
  answerCall: (callerId: string) => void;
  endCall: () => void;
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
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const { authUser } = useAuthContext();
  const remoteRTCMessage = useRef<any>(null);
  const otherUserId = useRef<string | null>(null);

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

      newSocket.on('newCall', async ({ callerId, rtcMessage }) => {
        remoteRTCMessage.current = rtcMessage;
        otherUserId.current = callerId;
        setupPeerConnection();
      });

      newSocket.on('callAnswered', async ({ rtcMessage }) => {
        remoteRTCMessage.current = rtcMessage;
        await peerConnection.current?.setRemoteDescription(
          new RTCSessionDescription(remoteRTCMessage.current)
        );
      });

      newSocket.on('ICEcandidate', async ({ rtcMessage }) => {
        if (peerConnection.current) {
          try {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(rtcMessage.candidate)
            );
            console.log("ICE candidate added successfully");
          } catch (err) {
            console.log("Error adding ICE candidate:", err);
          }
        }
      });

      return () => {
        newSocket.close();
      };
    }
  }, [authUser, socket]);

  const setupPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('ICEcandidate', {
          calleeId: otherUserId.current,
          rtcMessage: {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          },
        });
      } else {
        console.log("End of candidates.");
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };
  };

  const startCall = async (targetUserId: string) => {
    setupPeerConnection();
    otherUserId.current = targetUserId;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    setLocalStream(stream);
    stream.getTracks().forEach(track => 
      peerConnection.current?.addTrack(track, stream)
    );

    const sessionDescription = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(sessionDescription);
    socket?.emit('startCall', { 
      calleeId: targetUserId, 
      rtcMessage: sessionDescription 
    });
  };

  const answerCall = async (callerId: string) => {
    await peerConnection.current?.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current)
    );
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    setLocalStream(stream);
    stream.getTracks().forEach(track => 
      peerConnection.current?.addTrack(track, stream)
    );

    const sessionDescription = await peerConnection.current?.createAnswer();
    await peerConnection.current?.setLocalDescription(sessionDescription);
    socket?.emit('answerCall', {
      callerId,
      rtcMessage: sessionDescription
    });
  };

  const endCall = () => {
    localStream?.getTracks().forEach(track => track.stop());
    peerConnection.current?.close();
    peerConnection.current = null;
    setLocalStream(null);
    setRemoteStream(null);
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      onlineUsers, 
      localStream, 
      remoteStream,
      startCall,
      answerCall,
      endCall
    }}>
      {children}
    </SocketContext.Provider>
  );
};
