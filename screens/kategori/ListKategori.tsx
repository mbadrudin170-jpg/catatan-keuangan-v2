import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function ListKategori() {
  return (
    <SafeAreaView>
      <View>
        <Pressable>
          <Text>Kategori</Text>
          <Text>Sub Kategori</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
