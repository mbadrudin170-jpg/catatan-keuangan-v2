import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface TombolSimpanProps {
  onPress: () => void;
}

export default function TombolSimpan({ onPress }: TombolSimpanProps) {
  return (
    <Pressable style={styles.saveButton} onPress={onPress}>
      <Text style={styles.saveButtonText}>Simpan</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
