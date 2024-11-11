import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

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
import { User } from '../interfaces/types';
import { useUsers } from '../hooks/useUsersHook';


const HomeScreen = () => {
  const { authUser, setAuthUser } = useAuthContext(); // Access token from context
  const router = useRouter();
  const { users, loading } = useUsers(authUser?.token || undefined);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    setAuthUser(null); // Reset authUser in context
    router.replace('/auth/AuthScreen');
  };

  const navigateToConversation = (user: User) => {
    router.push({
      pathname: `/home/conversation/${user._id}`,
      params: { userId: user._id },
    });
  };

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
