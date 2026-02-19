import React, { type JSX } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderDetailTransaksi from './HeaderDetailTransaksi';
import TombolHapusDetailTransaksi from './TombolHapusDetailTransaksi';
export default function ScreenDetailTransaksi(): JSX.Element {
  return (
    <SafeAreaView>
      <HeaderDetailTransaksi />
      <TombolHapusDetailTransaksi />
    </SafeAreaView>
  );
}
