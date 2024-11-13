import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="ChatHomeScreen"
        options={{
          title: 'chat',
          tabBarIcon: ({ color }) => <AntDesign name="heart" size={24} color="black" />,
        }}
      />
       <Tabs.Screen
        name="Notifications"
        options={{
          title: 'notifications',
          tabBarIcon: ({ color }) => <AntDesign name="heart" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}