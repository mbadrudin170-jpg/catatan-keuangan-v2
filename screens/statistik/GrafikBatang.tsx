// screens/statistik/GrafikBatang.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { WARNA } from './konstanta';
import type { DataGrafikBatang } from './tipe'; // DIUBAH

interface GrafikBatangProps {
  data: DataGrafikBatang[];
}

export const GrafikBatang = ({ data }: GrafikBatangProps) => {
  const screenWidth = Dimensions.get('window').width;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Format angka ke Rupiah (tanpa desimal)
  const formatRupiah = (value: number) => {
    return 'Rp ' + value.toLocaleString('id-ID');
  };

  const dataGrafik = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.pemasukan),
        color: (opacity = 1) =>
          WARNA.HIJAU +
          Math.round(opacity * 255)
            .toString(16)
            .padStart(2, '0'),
      },
      {
        data: data.map((d) => d.pengeluaran),
        color: (opacity = 1) =>
          WARNA.MERAH +
          Math.round(opacity * 255)
            .toString(16)
            .padStart(2, '0'),
      },
    ],
  };

  return (
    <Animated.View style={[styles.pembungkus, { opacity: fadeAnim }]}>
      <BarChart
        data={dataGrafik}
        width={screenWidth - 72} // Disesuaikan dengan padding parent
        height={240}
        fromZero
        yAxisLabel="Rp "
        yAxisSuffix=""
        verticalLabelRotation={25}
        showValuesOnTopOfBars
        showBarTops={false}
        withInnerLines={true}
        chartConfig={{
          backgroundColor: WARNA.SURFACE,
          backgroundGradientFrom: WARNA.SURFACE,
          backgroundGradientTo: WARNA.SURFACE,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
          barPercentage: 0.7,
          fillShadowGradientOpacity: 1,
          propsForBackgroundLines: {
            stroke: WARNA.BORDER,
            strokeDasharray: '5, 5',
          },
          propsForLabels: {
            fontSize: 11,
          },
          formatTopBarValue: (value) => formatRupiah(value),
          style: {
            borderRadius: 24,
          },
        }}
        style={styles.gayaGrafik}
      />

      {/* Legenda */}
      <View style={styles.wadahLegenda}>
        <View style={styles.itemLegenda}>
          <View style={[styles.titikLegenda, { backgroundColor: WARNA.HIJAU }]} />
          <Text style={styles.teksLegenda}>Pemasukan</Text>
        </View>
        <View style={styles.itemLegenda}>
          <View style={[styles.titikLegenda, { backgroundColor: WARNA.MERAH }]} />
          <Text style={styles.teksLegenda}>Pengeluaran</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pembungkus: {
    backgroundColor: WARNA.SURFACE,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: WARNA.BORDER,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    // Margin dihilangkan dari sini, akan diatur oleh parent
  },
  gayaGrafik: {
    borderRadius: 24,
    marginBottom: 12,
    // Grafik akan mengisi ruang yang diberikan oleh parent
  },
  wadahLegenda: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  itemLegenda: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  titikLegenda: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  teksLegenda: {
    fontSize: 13,
    color: WARNA.TEKS_SEKUNDER || '#64748B',
    fontWeight: '500',
  },
});
