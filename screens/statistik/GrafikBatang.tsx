// screens/statistik/GrafikBatang.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { DataGrafikBatang } from './data';
import { WARNA } from './konstanta';

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
  }, []);

  // Format angka ke Rupiah (tanpa desimal)
  const formatRupiah = (value: number) => {
    return 'Rp ' + value.toLocaleString('id-ID');
  };

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.pemasukan),
        color: (opacity = 1) =>
          WARNA.hijau +
          Math.round(opacity * 255)
            .toString(16)
            .padStart(2, '0'),
      },
      {
        data: data.map((d) => d.pengeluaran),
        color: (opacity = 1) =>
          WARNA.merah +
          Math.round(opacity * 255)
            .toString(16)
            .padStart(2, '0'),
      },
    ],
  };

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
      <BarChart
        data={chartData}
        width={screenWidth - 60}
        height={240}
        fromZero
        yAxisLabel="Rp "
        yAxisSuffix=""
        verticalLabelRotation={25}
        showValuesOnTopOfBars
        showBarTops={false}
        withInnerLines={true}
        chartConfig={{
          backgroundColor: WARNA.surface,
          backgroundGradientFrom: WARNA.surface,
          backgroundGradientTo: WARNA.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
          barPercentage: 0.7,
          fillShadowGradientOpacity: 1,
          propsForBackgroundLines: {
            stroke: WARNA.border,
            strokeDasharray: '5, 5',
          },
          propsForLabels: {
            fontSize: 11,
          },
          formatTopBarValue: (value) => formatRupiah(value), // optional
          style: {
            borderRadius: 24,
          },
        }}
        style={styles.chartStyle}
      />

      {/* Legenda */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: WARNA.hijau }]} />
          <Text style={styles.legendText}>Pemasukan</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: WARNA.merah }]} />
          <Text style={styles.legendText}>Pengeluaran</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: WARNA.surface,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: WARNA.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  chartStyle: {
    borderRadius: 24,
    marginBottom: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: WARNA.teksSekunder || '#64748B',
    fontWeight: '500',
  },
});
