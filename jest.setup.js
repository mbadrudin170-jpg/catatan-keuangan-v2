// mbadrudin170-jpg/catatan-keuangan-v2/catatan-keuangan-v2-7b2316d6ef61dbbc9b2fd4205999ee351fe261a6/jest.setup.js

import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-icons untuk menghindari peringatan 'act(...)' dan mempercepat test
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name, size, color, testID }) => (
      <Text testID={testID} style={{ color, fontSize: size }}>
        {name}
      </Text>
    ),
    MaterialCommunityIcons: ({ name, size, color, testID }) => (
      <Text testID={testID} style={{ color, fontSize: size }}>
        {name}
      </Text>
    ),
    MaterialIcons: ({ name, size, color, testID }) => (
      <Text testID={testID} style={{ color, fontSize: size }}>
        {name}
      </Text>
    ),
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children, style, testID }) => {
      const { View } = require('react-native');
      return (
        <View style={style} testID={testID}>
          {children}
        </View>
      );
    },
    useSafeAreaInsets: () => inset,
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: inset,
    },
  };
});

// Mock react-native module
jest.mock('react-native', () => {
  const actualReactNative = jest.requireActual('react-native');
  return Object.setPrototypeOf(
    {
      Alert: { alert: jest.fn() },
      NativeEventEmitter: jest.fn().mockImplementation(() => ({
        addListener: jest.fn(),
        removeListeners: jest.fn(),
        removeAllListeners: jest.fn(),
      })),
      NativeModules: {
        ...actualReactNative.NativeModules,
        DevMenu: { show: jest.fn(), hide: jest.fn() },
      },
    },
    actualReactNative
  );
});

// Mock expo-sqlite
jest.mock('expo-sqlite', () => {
  const mockDb = {
    execAsync: jest.fn().mockResolvedValue([]),
    runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1 }),
    getAllAsync: jest.fn().mockResolvedValue([]),
    getFirstAsync: jest.fn().mockResolvedValue(null),
  };
  return { openDatabaseSync: jest.fn(() => mockDb) };
});

// Mock async storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock database operations
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
