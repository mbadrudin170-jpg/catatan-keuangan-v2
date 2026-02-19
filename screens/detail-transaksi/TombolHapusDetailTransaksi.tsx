// screens/detail-transaksi/TombolHapusDetailTransaksi.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useLogikaDetailTransaksi } from './logikaDetailTransaksi';

const TombolHapusDetailTransaksi: React.FC = () => {
  const { isLoading, hapusTransaksi } = useLogikaDetailTransaksi();

  return (
    <TouchableOpacity
      onPress={hapusTransaksi}
      style={[styles.button, isLoading && styles.buttonDisabled]}
      disabled={isLoading}
    >
      <Text style={styles.buttonText}>{isLoading ? 'Menghapus...' : 'Hapus Transaksi'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6347', // Tomato color for delete
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#FF634780', // Lighter tomato for disabled state
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TombolHapusDetailTransaksi;
