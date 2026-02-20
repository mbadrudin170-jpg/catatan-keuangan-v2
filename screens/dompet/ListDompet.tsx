// screens/dompet/ListDompet.tsx

import { Dompet } from '@/database/tipe';
import { formatMataUang } from '@/utils/formatMataUang';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

interface ListDompetProps {
  dompet: Dompet[];
  onPress: (id: number) => void;
}

const ListDompet: React.FC<ListDompetProps> = ({ dompet, onPress }) => {
  // Mengelompokkan data berdasarkan tipe dompet
  const sections = dompet.reduce((acc, current) => {
    const found = acc.find((section) => section.title === current.tipe);
    if (found) {
      found.data.push(current);
    } else {
      acc.push({ title: current.tipe, data: [current] });
    }
    return acc;
  }, [] as { title: string; data: Dompet[] }[]);

  const renderItem = ({ item }: { item: Dompet }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: item.tipe === 'Bank' ? '#1A237E' : '#004D40' },
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(item.id)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.tipe === 'Bank' ? 'business' : 'wallet'} size={22} color="#FFFFFF" />
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="rgba(255,255,255,0.5)" />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.namaDompet}>{item.nama}</Text>
        <Text style={styles.saldoText}>{formatMataUang(item.saldo)}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.chipText}>ID: {String(item.id).padStart(4, '0')}</Text>
        <View style={styles.badgeTipe}>
          <Text style={styles.tipeTextSmall}>{item.tipe}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.sectionLine} />
        </View>
      )}
      contentContainerStyle={styles.listContainer}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#546E7A',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginRight: 10,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ECEFF1',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    height: 170,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardBody: {
    marginVertical: 8,
  },
  namaDompet: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  saldoText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  badgeTipe: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tipeTextSmall: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default ListDompet;
