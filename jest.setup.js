import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Mock react-native module to provide stable mocks for Alert and other native components
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'), // Gunakan implementasi asli untuk semua yang lain
  Alert: {
    alert: jest.fn(), // Timpa Alert.alert dengan mock function
  },
  NativeEventEmitter: jest.fn().mockImplementation(() => ({ // Timpa NativeEventEmitter
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  })),
}));

// Mock expo-sqlite
jest.mock('expo-sqlite', () => {
  const mockDb = {
    execAsync: jest.fn().mockResolvedValue([]),
    runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1 }),
    getAllAsync: jest.fn().mockResolvedValue([]),
    getFirstAsync: jest.fn().mockResolvedValue(null),
  };

  return {
    openDatabaseSync: jest.fn(() => mockDb),
  };
});

// Mock async storage jika ada
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock untuk path alias @/
jest.mock(
  '@/database/operasi',
  () => ({
    ambilSemuaTransaksi: jest.fn(),
    tambahSatuTransaksi: jest.fn(),
    ambilSemuaKategori: jest.fn(),
    tambahKategori: jest.fn(),
    perbaruiKategori: jest.fn(),
    hapusKategori: jest.fn(),
    ambilSemuaDompet: jest.fn(),
    tambahDompet: jest.fn(),
    perbaruiDompet: jest.fn(),
    hapusDompet: jest.fn(),
    tambahSubkategori: jest.fn(),
    perbaruiSubkategori: jest.fn(),
    hapusSubkategori: jest.fn(),
  }),
  { virtual: true }
);
