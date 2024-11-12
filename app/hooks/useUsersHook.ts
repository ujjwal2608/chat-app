import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../interfaces/types';
import { Alert } from 'react-native';
import { BASE_URL } from '../constants';

export const useUsers = (authToken: string | undefined) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!authToken) return;
      
      try {
        const response = await axios.get(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', 'Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authToken]);

  return { users, loading };
}; 