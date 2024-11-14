import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { io } from 'socket.io-client';
import { BASE_URL } from '../constants';
const IncomingCallScreen = () => {
  const router = useRouter();
  const [callerId, setCallerId] = useState<string | null>(null);
  const socket = io(BASE_URL);

  useEffect(() => {
    // Listen for incoming call
    socket.on('incoming_call', (data) => {
      setCallerId(data.callerId); // Assuming data contains callerId
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAccept = () => {
    // Accept the call and navigate to VideoCallScreen
    socket.emit('accept_call', { callerId });
    router.push(`/chat/VideoCall?userId=${callerId}`);
  };

  const handleDecline = () => {
    // Decline the call
    socket.emit('decline_call', { callerId });
    router.back();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Incoming Call from {callerId || 'Unknown'}...</Text>
      <Button title="Accept" onPress={handleAccept} />
      <Button title="Decline" onPress={handleDecline} />
    </View>
  );
};

export default IncomingCallScreen;