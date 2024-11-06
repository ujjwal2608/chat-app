import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { useSocketContext } from '../../context/SocketContext';
const ConversationScreen = () => {

  
  const {userId} =useLocalSearchParams()
  const { socket } = useSocketContext(); 
  console.log(userId)
  //const { userId, userName } = route.params; // Assuming you're passing userId as a route parameter
  const { authUser } = useAuthContext(); // Get the token from AuthContext
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
console.log("the userId is ",userId)
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !authUser) {
        console.error('Missing userId or authUser');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`https://chat-app-backend-tl4j.onrender.com/messages/${userId}`, {
          headers: {
            Authorization: `Bearer ${authUser.token}`, // Include token in headers
          },
        });
        console.log(response.data)
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId, authUser]);
  
  useEffect(() => {
    // Listen for incoming messages from socket
    if (socket) {
      console.log("socket")

      socket.on('newMessage', (newMessage) => {
        console.log(newMessage)
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Append the new message
      });

      // Cleanup on component unmount
      return () => {
        socket.off('newMessage'); // Unsubscribe from event
      };
    }
  }, [socket, userId,setMessages]);// Dependency array includes userId and authUser

  return (
    <View style={styles.container}>
        {/* <Text>{userId}</Text> */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id} // Adjust based on your message ID structure
          renderItem={({ item }) => (
            <View style={styles.messageItem}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.timestampText}>
              {new Date(item.createdAt).toLocaleString()} {/* Format timestamp */}
            </Text>
          </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  messageItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});

export default ConversationScreen;
