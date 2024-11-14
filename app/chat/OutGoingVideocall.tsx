import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { io } from 'socket.io-client';
import { BASE_URL } from '../constants';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
const OutgoingCallScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { userId } = useLocalSearchParams()
  const socket = io(BASE_URL);
  useEffect(() => {
    // Send offer to the selected user
    socket.emit('call_user', { targetUserId: userId });

    // Listen for call acceptance
    socket.on('call_accepted', () => {
      router.push(`/chat/VideoCall?userId=${userId}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Calling {userId}...</Text>
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default OutgoingCallScreen;