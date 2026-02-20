import { db } from '@/database/sqlite';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Tipe Data ─────────────────────────────────────────────────────────────────

interface KategoriAnggaran {
  id: number;
  nama: string;
  ikon: string | null;
  totalPengeluaran: number;
  batasAnggaran: number;
}

interface StatistikBulan {
  totalPemasukan: number;
  totalPengeluaran: number;
  sisaSaldo: number;
}

// ─── Utilitas ──────────────────────────────────────────────────────────────────

const formatRupiah = (angka: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);

const bulanIndo = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const warnaPersen = (p: number): string => {
  if (p >= 100) return '#EF4444';
  if (p >= 75) return '#F97316';
  if (p >= 50) return '#EAB308';
  return '#22C55E';
};

// ─── ProgressBar ───────────────────────────────────────────────────────────────

const ProgressBar = ({ persen, warna }: { persen: number; warna: string }) => (
  <View style={styles.progressTrack}>
    <View
      style={[
        styles.progressFill,
        { width: `${Math.min(persen, 100)}%` as any, backgroundColor: warna },
      ]}
    />
  </View>
);

// ─── Kartu Kategori ────────────────────────────────────────────────────────────

const KartuKategori = ({ item, onTekan }: { item: KategoriAnggaran; onTekan: () => void }) => {
  const persen = item.batasAnggaran > 0 ? (item.totalPengeluaran / item.batasAnggaran) * 100 : 0;
  const warna = warnaPersen(persen);
  const sisa = item.batasAnggaran - item.totalPengeluaran;

  return (
    <TouchableOpacity style={styles.kartu} onPress={onTekan} activeOpacity={0.8}>
      <View style={styles.kartuHeader}>
        <View style={styles.kartuKiri}>
          <Text style={styles.kartuIkon}>{item.ikon ?? '💰'}</Text>
          <Text style={styles.kartuNama} numberOfLines={1}>
            {item.nama}
          </Text>
        </View>
        {item.batasAnggaran > 0 && (
          <View style={[styles.badge, { backgroundColor: warna + '22', borderColor: warna }]}>
            <Text style={[styles.badgeTeks, { color: warna }]}>{persen.toFixed(0)}%</Text>
          </View>
        )}
      </View>

      {item.batasAnggaran > 0 ? (
        <>
          <ProgressBar persen={persen} warna={warna} />
          <View style={styles.kartuInfo}>
            <Text style={styles.kartuTerpakai}>{formatRupiah(item.totalPengeluaran)}</Text>
            <Text style={styles.kartuBatas}>dari {formatRupiah(item.batasAnggaran)}</Text>
          </View>
          <Text style={[styles.kartuSisa, { color: sisa < 0 ? '#EF4444' : '#6B7280' }]}>
            {sisa < 0
              ? `⚠️ Melebihi ${formatRupiah(Math.abs(sisa))}`
              : `Sisa ${formatRupiah(sisa)}`}
          </Text>
        </>
      ) : (
        <View style={styles.belumDiaturWrap}>
          <Text style={styles.pengeluaranSaja}>
            Pengeluaran: {formatRupiah(item.totalPengeluaran)}
          </Text>
          <Text style={styles.belumDiaturTeks}>Ketuk untuk atur batas</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── Modal Atur Anggaran ───────────────────────────────────────────────────────

const ModalAnggaran = ({
  visible,
  item,
  onTutup,
  onSimpan,
}: {
  visible: boolean;
  item: KategoriAnggaran | null;
  onTutup: () => void;
  onSimpan: (id: number, batas: number) => void;
}) => {
  const [inputBatas, setInputBatas] = useState('');

  React.useEffect(() => {
    if (item) setInputBatas(item.batasAnggaran > 0 ? String(item.batasAnggaran) : '');
  }, [item]);

  const handleSimpan = () => {
    const nilai = parseFloat(inputBatas.replace(/[^0-9]/g, ''));
    if (isNaN(nilai) || nilai <= 0) {
      Alert.alert('Input Tidak Valid', 'Masukkan nominal anggaran yang valid.');
      return;
    }
    onSimpan(item!.id, nilai);
    onTutup();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onTutup}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalKonten}>
          <Text style={styles.modalJudul}>{item?.ikon ?? '💰'} Atur Batas Anggaran</Text>
          <Text style={styles.modalSubjudul}>{item?.nama}</Text>

          <View style={styles.inputWrap}>
            <Text style={styles.inputPrefix}>Rp</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              value={inputBatas}
              onChangeText={(t) => setInputBatas(t.replace(/[^0-9]/g, ''))}
            />
          </View>

          <View style={styles.modalBaris}>
            <TouchableOpacity style={styles.tombolBatal} onPress={onTutup}>
              <Text style={styles.tombolBatalTeks}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tombolSimpan} onPress={handleSimpan}>
              <Text style={styles.tombolSimpanTeks}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Layar Utama ───────────────────────────────────────────────────────────────

const HalamanAnggaran: React.FC = () => {
  const now = new Date();
  const [bulanDipilih, setBulanDipilih] = useState(now.getMonth());
  const [tahunDipilih, setTahunDipilih] = useState(now.getFullYear());
  const [daftarKategori, setDaftarKategori] = useState<KategoriAnggaran[]>([]);
  const [statistik, setStatistik] = useState<StatistikBulan>({
    totalPemasukan: 0,
    totalPengeluaran: 0,
    sisaSaldo: 0,
  });
  const [memuat, setMemuat] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [kategoriDipilih, setKategoriDipilih] = useState<KategoriAnggaran | null>(null);

  // Batas anggaran disimpan in-memory. Ganti dengan AsyncStorage untuk persistensi.
  const [batasAnggaran, setBatasAnggaran] = useState<Record<number, number>>({});

  const periodePrefix = `${tahunDipilih}-${String(bulanDipilih + 1).padStart(2, '0')}`;

  const muatData = useCallback(async () => {
    setMemuat(true);
    try {
      const kategori = await db.getAllAsync<{ id: number; nama: string; ikon: string | null }>(
        `SELECT id, nama, ikon FROM kategori WHERE tipe = 'pengeluaran' ORDER BY nama ASC`
      );

      const pengeluaran = await db.getAllAsync<{ kategori_id: number | null; total: number }>(
        `SELECT kategori_id, SUM(jumlah) as total
         FROM transaksi
         WHERE tipe = 'pengeluaran' AND tanggal LIKE ?
         GROUP BY kategori_id`,
        [`${periodePrefix}%`]
      );

      const mapPengeluaran: Record<number, number> = {};
      pengeluaran.forEach((p: { kategori_id: number | null; total: number }) => {
        if (p.kategori_id != null) mapPengeluaran[p.kategori_id] = p.total;
      });

      const hasil: KategoriAnggaran[] = kategori.map(
        (k: { id: number; nama: string; ikon: string | null }) => ({
          id: k.id,
          nama: k.nama,
          ikon: k.ikon,
          totalPengeluaran: mapPengeluaran[k.id] ?? 0,
          batasAnggaran: batasAnggaran[k.id] ?? 0,
        })
      );

      const rowStat = await db.getFirstAsync<{
        totalPemasukan: number;
        totalPengeluaran: number;
      }>(
        `SELECT
           SUM(CASE WHEN tipe='pemasukan' THEN jumlah ELSE 0 END) as totalPemasukan,
           SUM(CASE WHEN tipe='pengeluaran' THEN jumlah ELSE 0 END) as totalPengeluaran
         FROM transaksi WHERE tanggal LIKE ?`,
        [`${periodePrefix}%`]
      );

      const tPemasukan = rowStat?.totalPemasukan ?? 0;
      const tPengeluaran = rowStat?.totalPengeluaran ?? 0;

      setDaftarKategori(hasil);
      setStatistik({
        totalPemasukan: tPemasukan,
        totalPengeluaran: tPengeluaran,
        sisaSaldo: tPemasukan - tPengeluaran,
      });
    } catch (e) {
      console.error('Gagal memuat anggaran:', e);
      Alert.alert('Error', 'Gagal memuat data anggaran.');
    } finally {
      setMemuat(false);
    }
  }, [periodePrefix, batasAnggaran]);

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );

  const pindahBulan = (arah: -1 | 1) => {
    const d = new Date(tahunDipilih, bulanDipilih + arah, 1);
    setBulanDipilih(d.getMonth());
    setTahunDipilih(d.getFullYear());
  };

  const simpanBatas = (id: number, batas: number) =>
    setBatasAnggaran((prev) => ({ ...prev, [id]: batas }));

  const totalBatas = daftarKategori.reduce((a, k) => a + k.batasAnggaran, 0);
  const persenKeseluruhan = totalBatas > 0 ? (statistik.totalPengeluaran / totalBatas) * 100 : 0;

  return (
    <View style={styles.kontainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerJudul}>Anggaran</Text>
        <Text style={styles.headerSubjudul}>Pantau pengeluaran Anda</Text>
      </View>

      {/* ── Navigasi Bulan ── */}
      <View style={styles.navBulan}>
        <TouchableOpacity onPress={() => pindahBulan(-1)} style={styles.tombolPanah}>
          <Text style={styles.panahTeks}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.labelBulan}>
          {bulanIndo[bulanDipilih]} {tahunDipilih}
        </Text>
        <TouchableOpacity onPress={() => pindahBulan(1)} style={styles.tombolPanah}>
          <Text style={styles.panahTeks}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollKonten} showsVerticalScrollIndicator={false}>
        {/* ── Kartu Ringkasan ── */}
        <View style={styles.ringkasanKartu}>
          <View style={styles.ringkasanBaris}>
            <View style={styles.ringkasanItem}>
              <Text style={styles.ringkasanLabel}>Pemasukan</Text>
              <Text style={[styles.ringkasanNilai, { color: '#22C55E' }]}>
                {formatRupiah(statistik.totalPemasukan)}
              </Text>
            </View>
            <View style={styles.pemisah} />
            <View style={styles.ringkasanItem}>
              <Text style={styles.ringkasanLabel}>Pengeluaran</Text>
              <Text style={[styles.ringkasanNilai, { color: '#EF4444' }]}>
                {formatRupiah(statistik.totalPengeluaran)}
              </Text>
            </View>
          </View>

          <View style={styles.garisRingkasan} />

          <View style={styles.ringkasanSisa}>
            <Text style={styles.ringkasanLabel}>Saldo Bersih Bulan Ini</Text>
            <Text
              style={[
                styles.ringkasanNilaiUtama,
                { color: statistik.sisaSaldo >= 0 ? '#22C55E' : '#EF4444' },
              ]}
            >
              {formatRupiah(statistik.sisaSaldo)}
            </Text>
          </View>

          {totalBatas > 0 && (
            <View style={styles.progressKeseluruhan}>
              <View style={styles.progressKeseluruhanHeader}>
                <Text style={styles.progressLabel}>Total Anggaran Terpakai</Text>
                <Text style={[styles.progressPersen, { color: warnaPersen(persenKeseluruhan) }]}>
                  {persenKeseluruhan.toFixed(1)}%
                </Text>
              </View>
              <ProgressBar persen={persenKeseluruhan} warna={warnaPersen(persenKeseluruhan)} />
              <Text style={styles.progressDetail}>
                {formatRupiah(statistik.totalPengeluaran)} / {formatRupiah(totalBatas)}
              </Text>
            </View>
          )}
        </View>

        {/* ── Daftar Kategori ── */}
        <Text style={styles.seksionJudul}>Anggaran per Kategori</Text>
        <Text style={styles.seksionSubjudul}>Ketuk kategori untuk mengatur batas anggaran</Text>

        {memuat ? (
          <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
        ) : daftarKategori.length === 0 ? (
          <View style={styles.kosong}>
            <Text style={styles.kosongIkon}>📂</Text>
            <Text style={styles.kosongTeks}>Belum ada kategori pengeluaran</Text>
          </View>
        ) : (
          daftarKategori.map((item) => (
            <KartuKategori
              key={item.id}
              item={item}
              onTekan={() => {
                setKategoriDipilih(item);
                setModalVisible(true);
              }}
            />
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      <ModalAnggaran
        visible={modalVisible}
        item={kategoriDipilih}
        onTutup={() => setModalVisible(false)}
        onSimpan={simpanBatas}
      />
    </View>
  );
};

// ─── StyleSheet ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  kontainer: { flex: 1, backgroundColor: '#F1F5F9' },
  header: {
    backgroundColor: '#1E1B4B',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 12 : 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerJudul: { fontSize: 26, fontWeight: '700', color: '#FFFFFF' },
  headerSubjudul: { fontSize: 13, color: '#A5B4FC', marginTop: 2 },
  navBulan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#312E81',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tombolPanah: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panahTeks: { color: '#FFFFFF', fontSize: 22, lineHeight: 26 },
  labelBulan: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  scrollKonten: { padding: 16 },

  // Ringkasan
  ringkasanKartu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  ringkasanBaris: { flexDirection: 'row', justifyContent: 'space-around' },
  ringkasanItem: { flex: 1, alignItems: 'center' },
  pemisah: { width: 1, backgroundColor: '#E5E7EB' },
  ringkasanLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  ringkasanNilai: { fontSize: 15, fontWeight: '700' },
  garisRingkasan: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 14 },
  ringkasanSisa: { alignItems: 'center' },
  ringkasanNilaiUtama: { fontSize: 24, fontWeight: '800', marginTop: 2 },
  progressKeseluruhan: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  progressKeseluruhanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: { fontSize: 12, color: '#6B7280' },
  progressPersen: { fontSize: 12, fontWeight: '700' },
  progressDetail: { fontSize: 11, color: '#9CA3AF', marginTop: 4, textAlign: 'right' },

  // Seksion
  seksionJudul: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  seksionSubjudul: { fontSize: 12, color: '#9CA3AF', marginBottom: 12 },

  // Kartu
  kartu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  kartuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  kartuKiri: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  kartuIkon: { fontSize: 22, marginRight: 10 },
  kartuNama: { fontSize: 15, fontWeight: '600', color: '#1F2937', flex: 1 },
  badge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  badgeTeks: { fontSize: 12, fontWeight: '700' },
  progressTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: '100%', borderRadius: 4 },
  kartuInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  kartuTerpakai: { fontSize: 13, fontWeight: '600', color: '#374151' },
  kartuBatas: { fontSize: 12, color: '#9CA3AF' },
  kartuSisa: { fontSize: 12, marginTop: 2 },
  belumDiaturWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pengeluaranSaja: { fontSize: 13, color: '#374151' },
  belumDiaturTeks: { fontSize: 12, color: '#6366F1', fontStyle: 'italic' },

  // Kosong
  kosong: { alignItems: 'center', marginTop: 40 },
  kosongIkon: { fontSize: 48, marginBottom: 10 },
  kosongTeks: { fontSize: 14, color: '#9CA3AF' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalKonten: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalJudul: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubjudul: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 20 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6366F1',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  inputPrefix: { fontSize: 16, color: '#6366F1', fontWeight: '700', marginRight: 8 },
  input: { flex: 1, fontSize: 20, fontWeight: '600', color: '#1F2937', paddingVertical: 12 },
  modalBaris: { flexDirection: 'row', gap: 12 },
  tombolBatal: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  tombolBatalTeks: { fontSize: 15, color: '#6B7280', fontWeight: '600' },
  tombolSimpan: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  tombolSimpanTeks: { fontSize: 15, color: '#FFFFFF', fontWeight: '700' },
});

export default HalamanAnggaran;
