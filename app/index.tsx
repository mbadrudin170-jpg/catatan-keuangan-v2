import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function index() {
  return (
    <SafeAreaView>
      <View>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </Pressable>
        <Text>Header</Text>
      </View>

    </SafeAreaView>
  );
}
