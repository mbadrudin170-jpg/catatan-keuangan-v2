const mockDb = {
  execSync: () => {},
  prepareSync: () => ({
    executeSync: () => ({ /* implementasi palsu */ }),
  }),
  closeSync: () => {},
};

export default {
  openDatabaseSync: () => mockDb,
  NativeDatabase: function () { /* konstruktor palsu */ },
};
