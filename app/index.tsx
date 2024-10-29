import { Stack, Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
    <SafeAreaView>
      <View>
        <Text className=''>hello</Text>
      </View>
    </SafeAreaView>
    </>
  );
}
