import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderDetailTransaksi from './HeaderDetailTransaksi';
import TombolHapusDetailTransaksi from './TombolHapusDetailTransaksi';
export default function ScreenDetailTransaksi() {
  return (
    <SafeAreaView>
      <HeaderDetailTransaksi />
      <TombolHapusDetailTransaksi />
    </SafeAreaView>
  );
}
