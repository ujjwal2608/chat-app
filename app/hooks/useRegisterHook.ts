import axios from 'axios';
import { Alert } from 'react-native';

import { BASE_URL } from '../constants';

export const useRegister = () => {
  const register = async (name: string, phoneNumber: string, password: string) => {
    try {
      await axios.post(`${BASE_URL}/register`, {
        name,
        phoneNumber,
        password,
      });
      Alert.alert('Success', 'Registration successful. Please log in.');
      return true;
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || error.message || 'An error occurred');
      throw error;
    }
  };

  return { register };
};
