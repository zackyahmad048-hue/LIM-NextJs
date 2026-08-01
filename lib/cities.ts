export interface City {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  timezone: number; // +7 (WIB), +8 (WITA), +9 (WIT)
  timezoneName: string; // WIB, WITA, WIT
}

export const INDONESIA_CITIES: City[] = [
  // --- ACEH ---
  { name: 'Banda Aceh', province: 'Aceh', latitude: 5.5483, longitude: 95.3238, timezone: 7, timezoneName: 'WIB' },
  { name: 'Lhokseumawe', province: 'Aceh', latitude: 5.1804, longitude: 97.1407, timezone: 7, timezoneName: 'WIB' },
  { name: 'Langsa', province: 'Aceh', latitude: 4.4714, longitude: 97.9683, timezone: 7, timezoneName: 'WIB' },
  { name: 'Sabang', province: 'Aceh', latitude: 5.8936, longitude: 95.3204, timezone: 7, timezoneName: 'WIB' },
  
  // --- SUMATERA UTARA ---
  { name: 'Medan', province: 'Sumatera Utara', latitude: 3.5952, longitude: 98.6722, timezone: 7, timezoneName: 'WIB' },
  { name: 'Pematangsiantar', province: 'Sumatera Utara', latitude: 2.9592, longitude: 99.0687, timezone: 7, timezoneName: 'WIB' },
  { name: 'Binjai', province: 'Sumatera Utara', latitude: 3.6004, longitude: 98.4856, timezone: 7, timezoneName: 'WIB' },
  { name: 'Sibolga', province: 'Sumatera Utara', latitude: 1.7388, longitude: 98.7797, timezone: 7, timezoneName: 'WIB' },

  // --- SUMATERA BARAT ---
  { name: 'Padang', province: 'Sumatera Barat', latitude: -0.9471, longitude: 100.4172, timezone: 7, timezoneName: 'WIB' },
  { name: 'Bukittinggi', province: 'Sumatera Barat', latitude: -0.3056, longitude: 100.3692, timezone: 7, timezoneName: 'WIB' },
  { name: 'Payakumbuh', province: 'Sumatera Barat', latitude: -0.2247, longitude: 100.6318, timezone: 7, timezoneName: 'WIB' },

  // --- RIAU & KEPULAUAN RIAU ---
  { name: 'Pekanbaru', province: 'Riau', latitude: 0.5071, longitude: 101.4478, timezone: 7, timezoneName: 'WIB' },
  { name: 'Dumai', province: 'Riau', latitude: 1.6811, longitude: 101.4497, timezone: 7, timezoneName: 'WIB' },
  { name: 'Batam', province: 'Kepulauan Riau', latitude: 1.1301, longitude: 104.0529, timezone: 7, timezoneName: 'WIB' },
  { name: 'Tanjungpinang', province: 'Kepulauan Riau', latitude: 0.9167, longitude: 104.4500, timezone: 7, timezoneName: 'WIB' },

  // --- JAMBI, BENGKULU & SUMATERA SELATAN ---
  { name: 'Jambi', province: 'Jambi', latitude: -1.6101, longitude: 103.6131, timezone: 7, timezoneName: 'WIB' },
  { name: 'Palembang', province: 'Sumatera Selatan', latitude: -2.9761, longitude: 104.7754, timezone: 7, timezoneName: 'WIB' },
  { name: 'Lubuklinggau', province: 'Sumatera Selatan', latitude: -3.2965, longitude: 102.8614, timezone: 7, timezoneName: 'WIB' },
  { name: 'Bengkulu', province: 'Bengkulu', latitude: -3.7928, longitude: 102.2608, timezone: 7, timezoneName: 'WIB' },

  // --- LAMPUNG & BANGKA BELITUNG ---
  { name: 'Bandar Lampung', province: 'Lampung', latitude: -5.4500, longitude: 105.2667, timezone: 7, timezoneName: 'WIB' },
  { name: 'Metro', province: 'Lampung', latitude: -5.1136, longitude: 105.3069, timezone: 7, timezoneName: 'WIB' },
  { name: 'Pangkalpinang', province: 'Bangka Belitung', latitude: -2.1333, longitude: 106.1167, timezone: 7, timezoneName: 'WIB' },

  // --- DKI JAKARTA & BANTEN ---
  { name: 'Jakarta (DKI)', province: 'DKI Jakarta', latitude: -6.2088, longitude: 106.8456, timezone: 7, timezoneName: 'WIB' },
  { name: 'Serang', province: 'Banten', latitude: -6.1200, longitude: 106.1500, timezone: 7, timezoneName: 'WIB' },
  { name: 'Tangerang', province: 'Banten', latitude: -6.1783, longitude: 106.6300, timezone: 7, timezoneName: 'WIB' },
  { name: 'Tangerang Selatan', province: 'Banten', latitude: -6.2886, longitude: 106.7179, timezone: 7, timezoneName: 'WIB' },
  { name: 'Cilegon', province: 'Banten', latitude: -6.0175, longitude: 106.0538, timezone: 7, timezoneName: 'WIB' },

  // --- JAWA BARAT ---
  { name: 'Bandung', province: 'Jawa Barat', latitude: -6.9175, longitude: 107.6191, timezone: 7, timezoneName: 'WIB' },
  { name: 'Bogor', province: 'Jawa Barat', latitude: -6.5971, longitude: 106.7994, timezone: 7, timezoneName: 'WIB' },
  { name: 'Bekasi', province: 'Jawa Barat', latitude: -6.2383, longitude: 106.9756, timezone: 7, timezoneName: 'WIB' },
  { name: 'Depok', province: 'Jawa Barat', latitude: -6.4025, longitude: 106.7942, timezone: 7, timezoneName: 'WIB' },
  { name: 'Cirebon', province: 'Jawa Barat', latitude: -6.7320, longitude: 108.5523, timezone: 7, timezoneName: 'WIB' },
  { name: 'Sukabumi', province: 'Jawa Barat', latitude: -6.9277, longitude: 106.9300, timezone: 7, timezoneName: 'WIB' },
  { name: 'Tasikmalaya', province: 'Jawa Barat', latitude: -7.3274, longitude: 108.2207, timezone: 7, timezoneName: 'WIB' },
  { name: 'Cimahi', province: 'Jawa Barat', latitude: -6.8722, longitude: 107.5422, timezone: 7, timezoneName: 'WIB' },

  // --- JAWA TENGAH & DI YOGYAKARTA ---
  { name: 'Semarang', province: 'Jawa Tengah', latitude: -6.9667, longitude: 110.4167, timezone: 7, timezoneName: 'WIB' },
  { name: 'Surakarta (Solo)', province: 'Jawa Tengah', latitude: -7.5667, longitude: 110.8167, timezone: 7, timezoneName: 'WIB' },
  { name: 'Magelang', province: 'Jawa Tengah', latitude: -7.4706, longitude: 110.2178, timezone: 7, timezoneName: 'WIB' },
  { name: 'Pekalongan', province: 'Jawa Tengah', latitude: -6.8886, longitude: 109.6753, timezone: 7, timezoneName: 'WIB' },
  { name: 'Salatiga', province: 'Jawa Tengah', latitude: -7.3306, longitude: 110.5084, timezone: 7, timezoneName: 'WIB' },
  { name: 'Tegal', province: 'Jawa Tengah', latitude: -6.8694, longitude: 109.1403, timezone: 7, timezoneName: 'WIB' },
  { name: 'Purwokerto (Banyumas)', province: 'Jawa Tengah', latitude: -7.4244, longitude: 109.2392, timezone: 7, timezoneName: 'WIB' },
  { name: 'Yogyakarta', province: 'DI Yogyakarta', latitude: -7.7956, longitude: 110.3695, timezone: 7, timezoneName: 'WIB' },
  { name: 'Sleman', province: 'DI Yogyakarta', latitude: -7.7156, longitude: 110.3556, timezone: 7, timezoneName: 'WIB' },
  { name: 'Bantul', province: 'DI Yogyakarta', latitude: -7.8878, longitude: 110.3292, timezone: 7, timezoneName: 'WIB' },

  // --- JAWA TIMUR ---
  { name: 'Surabaya', province: 'Jawa Timur', latitude: -7.2575, longitude: 112.7521, timezone: 7, timezoneName: 'WIB' },
  { name: 'Malang', province: 'Jawa Timur', latitude: -7.9797, longitude: 112.6304, timezone: 7, timezoneName: 'WIB' },
  { name: 'Kediri', province: 'Jawa Timur', latitude: -7.8167, longitude: 112.0167, timezone: 7, timezoneName: 'WIB' },
  { name: 'Madiun', province: 'Jawa Timur', latitude: -7.6298, longitude: 111.5239, timezone: 7, timezoneName: 'WIB' },
  { name: 'Probolinggo', province: 'Jawa Timur', latitude: -7.7543, longitude: 113.2159, timezone: 7, timezoneName: 'WIB' },
  { name: 'Pasuruan', province: 'Jawa Timur', latitude: -7.6453, longitude: 112.9075, timezone: 7, timezoneName: 'WIB' },
  { name: 'Banyuwangi', province: 'Jawa Timur', latitude: -8.2192, longitude: 114.3691, timezone: 7, timezoneName: 'WIB' },
  { name: 'Batu', province: 'Jawa Timur', latitude: -7.8700, longitude: 112.5200, timezone: 7, timezoneName: 'WIB' },

  // --- BALI, NTB & NTT ---
  { name: 'Denpasar (Bali)', province: 'Bali', latitude: -8.6705, longitude: 115.2126, timezone: 8, timezoneName: 'WITA' },
  { name: 'Singaraja (Buleleng)', province: 'Bali', latitude: -8.1120, longitude: 115.0882, timezone: 8, timezoneName: 'WITA' },
  { name: 'Mataram (Lombok)', province: 'Nusa Tenggara Barat', latitude: -8.5833, longitude: 116.1167, timezone: 8, timezoneName: 'WITA' },
  { name: 'Bima', province: 'Nusa Tenggara Barat', latitude: -8.4600, longitude: 118.7200, timezone: 8, timezoneName: 'WITA' },
  { name: 'Kupang', province: 'Nusa Tenggara Timur', latitude: -10.1772, longitude: 123.6070, timezone: 8, timezoneName: 'WITA' },
  { name: 'Ende', province: 'Nusa Tenggara Timur', latitude: -8.8432, longitude: 121.6623, timezone: 8, timezoneName: 'WITA' },
  { name: 'Labuan Bajo', province: 'Nusa Tenggara Timur', latitude: -8.4964, longitude: 119.8877, timezone: 8, timezoneName: 'WITA' },

  // --- KALIMANTAN ---
  { name: 'Pontianak', province: 'Kalimantan Barat', latitude: -0.0263, longitude: 109.3425, timezone: 7, timezoneName: 'WIB' },
  { name: 'Singkawang', province: 'Kalimantan Barat', latitude: 0.9073, longitude: 108.9856, timezone: 7, timezoneName: 'WIB' },
  { name: 'Palangkaraya', province: 'Kalimantan Tengah', latitude: -2.2100, longitude: 113.9200, timezone: 7, timezoneName: 'WIB' },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', latitude: -3.3194, longitude: 114.5908, timezone: 8, timezoneName: 'WITA' },
  { name: 'Banjarbaru', province: 'Kalimantan Selatan', latitude: -3.4400, longitude: 114.8300, timezone: 8, timezoneName: 'WITA' },
  { name: 'Samarinda', province: 'Kalimantan Timur', latitude: -0.5022, longitude: 117.1536, timezone: 8, timezoneName: 'WITA' },
  { name: 'Balikpapan', province: 'Kalimantan Timur', latitude: -1.2379, longitude: 116.8529, timezone: 8, timezoneName: 'WITA' },
  { name: 'Bontang', province: 'Kalimantan Timur', latitude: 0.1333, longitude: 117.5000, timezone: 8, timezoneName: 'WITA' },
  { name: 'Tarakan', province: 'Kalimantan Utara', latitude: 3.3000, longitude: 117.6333, timezone: 8, timezoneName: 'WITA' },
  { name: 'Tanjung Selor', province: 'Kalimantan Utara', latitude: 2.8373, longitude: 117.3653, timezone: 8, timezoneName: 'WITA' },

  // --- SULAWESI & GORONTALO ---
  { name: 'Manado', province: 'Sulawesi Utara', latitude: 1.4748, longitude: 124.8428, timezone: 8, timezoneName: 'WITA' },
  { name: 'Bitung', province: 'Sulawesi Utara', latitude: 1.4450, longitude: 125.1824, timezone: 8, timezoneName: 'WITA' },
  { name: 'Gorontalo', province: 'Gorontalo', latitude: 0.5435, longitude: 123.0568, timezone: 8, timezoneName: 'WITA' },
  { name: 'Palu', province: 'Sulawesi Tengah', latitude: -0.8983, longitude: 119.8707, timezone: 8, timezoneName: 'WITA' },
  { name: 'Mamuju', province: 'Sulawesi Barat', latitude: -2.6770, longitude: 118.8895, timezone: 8, timezoneName: 'WITA' },
  { name: 'Makassar', province: 'Sulawesi Selatan', latitude: -5.1477, longitude: 119.4327, timezone: 8, timezoneName: 'WITA' },
  { name: 'Parepare', province: 'Sulawesi Selatan', latitude: -4.0131, longitude: 119.6247, timezone: 8, timezoneName: 'WITA' },
  { name: 'Palopo', province: 'Sulawesi Selatan', latitude: -2.9944, longitude: 120.1969, timezone: 8, timezoneName: 'WITA' },
  { name: 'Kendari', province: 'Sulawesi Tenggara', latitude: -3.9985, longitude: 122.5126, timezone: 8, timezoneName: 'WITA' },
  { name: 'Baubau', province: 'Sulawesi Tenggara', latitude: -5.4633, longitude: 122.6012, timezone: 8, timezoneName: 'WITA' },

  // --- MALUKU & PAPUA ---
  { name: 'Ambon', province: 'Maluku', latitude: -3.6554, longitude: 128.1906, timezone: 9, timezoneName: 'WIT' },
  { name: 'Tual', province: 'Maluku', latitude: -5.6292, longitude: 132.7505, timezone: 9, timezoneName: 'WIT' },
  { name: 'Ternate', province: 'Maluku Utara', latitude: 0.7906, longitude: 127.3804, timezone: 9, timezoneName: 'WIT' },
  { name: 'Tidore', province: 'Maluku Utara', latitude: 0.6866, longitude: 127.4042, timezone: 9, timezoneName: 'WIT' },
  { name: 'Jayapura', province: 'Papua', latitude: -2.5489, longitude: 140.7186, timezone: 9, timezoneName: 'WIT' },
  { name: 'Sorong', province: 'Papua Barat Daya', latitude: -0.8762, longitude: 131.2558, timezone: 9, timezoneName: 'WIT' },
  { name: 'Manokwari', province: 'Papua Barat', latitude: -0.8615, longitude: 134.0620, timezone: 9, timezoneName: 'WIT' },
  { name: 'Merauke', province: 'Papua Selatan', latitude: -8.4991, longitude: 140.4044, timezone: 9, timezoneName: 'WIT' },
  { name: 'Nabire', province: 'Papua Tengah', latitude: -3.3686, longitude: 135.4969, timezone: 9, timezoneName: 'WIT' },
  { name: 'Wamena (Jayawijaya)', province: 'Papua Pegunungan', latitude: -4.0956, longitude: 138.9463, timezone: 9, timezoneName: 'WIT' }
];

export const DEFAULT_CITY = INDONESIA_CITIES[22]; // Jakarta
