import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../context/AuthContext';


import { BASE_URL } from '../constants';

export const useLogin = () => {
  const router = useRouter();
  const { setAuthUser } = useAuthContext();

  const login = async (phoneNumber: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        phoneNumber,
        password,
      });

      if (response.data.token) {
        const token = response.data.token;
        const userId = response.data.data._id;
        const timeStamp = Date.now().toString();

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('timeStamp', timeStamp);
        setAuthUser({ token, userId });
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || error.message || 'An error occurred');
      throw error;
    }
  };

  return { login };
};
