// utils/i18n/index.ts
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Import file terjemahan
import en from './locales/en.json';
import id from './locales/id.json';

const i18n = new I18n();

// Setel terjemahan
i18n.store({
  en,
  id,
});

// Setel bahasa default berdasarkan lokal perangkat
const locales = Localization.getLocales();
if (locales && locales.length > 0) {
    i18n.locale = locales[0].languageCode ?? 'id';
} else {
    i18n.locale = 'id'; // default to Indonesian
}


// Aktifkan fallback jika kunci terjemahan tidak ditemukan di bahasa yang dipilih
i18n.enableFallback = true;

export default i18n;
