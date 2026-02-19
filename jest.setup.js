
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-sqlite-storage', () => ({
  openDatabase: () => ({
    transaction: () => ({}),
  }),
}));
