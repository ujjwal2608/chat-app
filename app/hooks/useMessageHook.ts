import { useState } from 'react';
import axios from 'axios';
import { Message } from '../interfaces/types';
import { BASE_URL } from '../constants';

interface UseMessagesProps {
  userId: string;
  authToken: string;
}

export const useMessages = ({ userId, authToken }: UseMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(2);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const fetchInitialMessages = async () => {
    if (!userId || !authToken) {
      console.error('Missing userId or authToken');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageData: Partial<Message>) => {
    try {
      await axios.post(
        `${BASE_URL}/messages/${userId}`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setMessages((prevMessages) => [messageData as Message, ...prevMessages]);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  const loadMoreMessages = async () => {
    if (hasReachedEnd) return;
    
    try {
      const response = await axios.get(
        `${BASE_URL}/messages/${userId}?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.length > 0) {
        setMessages((prevMessages) => [...prevMessages, ...response.data]);
        setPage((prevPage) => prevPage + 1);
        setHasReachedEnd(false);
      } else {
        setHasReachedEnd(true);
      }
    } catch (error) {
      console.error('Error fetching more messages:', error);
    }
  };

  const addNewSocketMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };

  return {
    messages,
    loading,
    hasReachedEnd,
    fetchInitialMessages,
    sendMessage,
    loadMoreMessages,
    addNewSocketMessage,
  };
};