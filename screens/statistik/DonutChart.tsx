// screens/statistik/DonutChart.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { WARNA } from './konstanta';

interface DonutChartProps {
  pemasukan: number;
  pengeluaran: number;
}

export const DonutChart = ({ pemasukan, pengeluaran }: DonutChartProps) => {
  const data = [
    {
      name: 'Pemasukan',
      population: pemasukan,
      color: WARNA.HIJAU,
      legendFontColor: WARNA.TEKS_UTAMA,
      legendFontSize: 12,
    },
    {
      name: 'Pengeluaran',
      population: pengeluaran,
      color: WARNA.MERAH,
      legendFontColor: WARNA.TEKS_UTAMA,
      legendFontSize: 12,
    },
  ];

  return (
    <View style={styles.container}>
      <PieChart
        data={data}
        width={200} // Lebar chart
        height={150} // Tinggi chart
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        center={[10, 0]} // Pusatkan chart
        hasLegend={false} // Sembunyikan legenda bawaan
        absolute // Tampilkan nilai absolut
      />
      <View style={styles.legendaContainer}>
        {data.map((item, index) => (
          <View style={styles.legendaItem} key={index}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.teksLegenda}>{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendaContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  teksLegenda: {
    color: WARNA.TEKS_UTAMA,
    fontSize: 12,
  },
});
