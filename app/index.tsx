import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { useAuthContext } from './context/AuthContext';

export default function AuthLoadingScreen() {
  const router = useRouter();
  const { setAuthUser } = useAuthContext();
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      const timeStamp = await AsyncStorage.getItem('timeStamp');
      const TIME_FOR_LOGIN = 10*60 * 60 * 1000;
      if (token && timeStamp && Date.now() - parseInt(timeStamp, 10) < TIME_FOR_LOGIN) {
        router.replace('/(tabs)'); // Redirect to main tabs screen
      } else {
        router.replace('/(auth)'); // Redirect to Auth if no token
        setAuthUser(null);
        await AsyncStorage.multiRemove(['token', 'timeStamp', 'userId']);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
