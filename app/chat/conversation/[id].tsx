import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import { Message } from '../../interfaces/types';
import { useAuthContext } from '../../context/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { useSocketContext } from '../../context/SocketContext';
import { useMessages } from '../../hooks/useMessageHook';

const ConversationScreen = () => {
  const { userId } = useLocalSearchParams();
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList<Message> | null>(null);

  const {
    messages,
    loading,
    hasReachedEnd,
    fetchInitialMessages,
    sendMessage,
    loadMoreMessages,
    addNewSocketMessage,
  } = useMessages({
    userId: typeof userId === 'string' ? userId : userId[0],
    authToken: authUser?.token || '',
  });

  useEffect(() => {
    fetchInitialMessages();
  }, [userId, authUser]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (newMessage: Message) => {
        addNewSocketMessage(newMessage);
        scrollToEnd();
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket]);

  const handleSendMessage = async () => {
    const messageData = {
      _id: `${Date.now()}`,
      senderId: authUser?.userId || '',
      receiverId: typeof userId === 'string' ? userId : userId[0],
      message: newMessage,
      createdAt: new Date().toISOString(),
    };

    const success = await sendMessage(messageData);
    if (success) {
      setNewMessage('');
      scrollToEnd();
    }
  };

  const handleEndReached = () => {
    if (!hasReachedEnd) {
      loadMoreMessages();
    }
  };

  const scrollToEnd = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: 1,
        viewPosition: 1,
      });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => `${item._id}_${item.createdAt}`}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageItem,
                item.receiverId._id === userId
                  ? styles.sentMessage
                  : styles.receivedMessage,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  item.receiverId._id === userId
                    ?styles.sentMessageText 
                    :styles.receivedMessageText,
                ]}>
                {item.message}
              </Text>
              <Text
                style={[
                  styles.timestampText,
                  item.receiverId._id === userId
                    ?styles.sentTimestamp 
                    :styles.receivedTimestamp,
                ]}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          )}
          getItemLayout={(data, index) => ({ length: 80, offset: 80 * index, index })}
          inverted
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
        />
      )}
      <TextInput placeholder="Type a message..." value={newMessage} onChangeText={setNewMessage} />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};
export default ConversationScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  messageItem: {
    padding: 15,
    marginBottom: 10,
    maxWidth: '80%',
    borderRadius: 12,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    marginLeft: '20%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8E8E8',
    marginRight: '20%',
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: 'white',
  },
  receivedMessageText: {
    color: 'black',
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  sentTimestamp: {
    color: 'white',
  },
  receivedTimestamp: {
    color: 'black',
  },
});
