import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useAuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  const { authUser, setAuthUser } = useAuthContext(); // Access token from context
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    setAuthUser(null); // Reset authUser in context
    router.replace('/auth/AuthScreen');
  };

  const navigateToConversation = (user) => {
    router.push({
      pathname: `/home/conversation/${user._id}`,
      params: { userId: user._id },
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (authUser?.token) {
        try {
          const response = await axios.get(`https://chat-app-backend-tl4j.onrender.com/users`, {
            headers: {
              Authorization: `Bearer ${authUser.token}`, // Send token in headers
            },
          });
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
          Alert.alert('Error', 'Failed to fetch users. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers(); // Fetch users on component mount if authUser is available
  }, [authUser?.token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home Screen</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <View>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToConversation(item)}>
                <View style={styles.userItem}>
                  <Text style={styles.userName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loaderContainer: {
    marginTop: 20,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 18,
  },
});

export default HomeScreen;
