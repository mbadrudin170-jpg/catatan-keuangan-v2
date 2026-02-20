// screens/form-kategori/FormKategoriScreen.tsx
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderFormKategori from './HeaderFormKategori';
import ListKategori from './ListKategori';
import ListSubKategori from './ListSubKategori';
import TombolTipe from './TombolTipe';
import { useFormKategori } from './useFormKategori';

const FormKategoriScreen: React.FC = () => {
  const {
    tipeAktif,
    setTipeAktif,
    kategoriTerpilih,
    setKategoriTerpilih,
    kategoriDisesuaikan,
    subkategoriTerpilih,
    tambahKategori,
    hapusKategori,
    tambahSubkategori,
    hapusSubkategori,
    perbaruiSubkategori,
    handleSimpan,
  } = useFormKategori();

  return (
    <SafeAreaView style={gaya.penampung} edges={['top', 'left', 'right', 'bottom']}>
      <HeaderFormKategori />
      <KeyboardAvoidingView
        style={gaya.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TombolTipe tipeAktif={tipeAktif} setTipeAktif={setTipeAktif} />

        <ScrollView contentContainerStyle={gaya.kontenGulir}>
          <ListKategori
            onKategoriSelect={setKategoriTerpilih}
            tipe={tipeAktif}
            daftarKategori={kategoriDisesuaikan}
            tambahKategori={tambahKategori}
            hapusKategori={hapusKategori}
          />
          <ListSubKategori
            kategoriTerpilih={kategoriTerpilih}
            subkategori={subkategoriTerpilih}
            tambahSubkategori={tambahSubkategori}
            hapusSubkategori={hapusSubkategori}
            perbaruiSubkategori={perbaruiSubkategori}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FormKategoriScreen;

const gaya = StyleSheet.create({
  penampung: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  kontenGulir: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  penampungTombol: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
});
