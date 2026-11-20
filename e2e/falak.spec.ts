import { expect, test } from '@playwright/test'

// Uji alur "set location" widget jadwal shalat:
// izin geolocation diberikan + API eksternal di-mock agar deterministik.
test.use({
  permissions: ['geolocation'],
  geolocation: { latitude: -7.2575, longitude: 112.7521 },
})

// Fixture mengikuti respons nyata digitalfalak.com (WS 24-jam, WIS 12-jam tanpa meridiem)
const WS_FIXTURE = {
  status: 'success',
  data: {
    tanggal: '18',
    imsak: '03:34',
    shubuh: '03:44',
    terbit: '05:00',
    dzuhur: '11:21',
    ashar: '14:42',
    maghrib: '17:34',
    isya: '18:48',
  },
}

const WIS_FIXTURE = {
  status: 'success',
  data: {
    tanggal: '18',
    imsak: '04:16',
    shubuh: '04:26',
    terbit: '05:43',
    dzuhur: '12:04',
    ashar: '03:25',
    maghrib: '06:17',
    isya: '07:31',
  },
}

test('deteksi lokasi memperbarui nama lokasi, jadwal, dan mode istiwa', async ({ page }) => {
  await page.route('**/nominatim.openstreetmap.org/**', (route) =>
    route.fulfill({ json: { address: { city: 'Surabaya', state: 'Jawa Timur' } } }),
  )
  await page.route(/digitalfalak\.com\/api\.php/, (route) => {
    const url = route.request().url()
    return route.fulfill({ json: url.includes('standar=WIS') ? WIS_FIXTURE : WS_FIXTURE })
  })

  await page.goto('/')

  // Tunggu widget ter-hydrate & jadwal awal termuat (klik sebelum hydration akan terbuang)
  await expect(page.getByText('Dzuhur', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Deteksi lokasi saya' }).click()

  // Nama lokasi berubah dari default Lirboyo
  await expect(page.locator('[title="Surabaya, Jawa Timur"]')).toBeVisible()
  await expect(page.getByText('Lokasi diperbarui: Surabaya, Jawa Timur')).toBeVisible()

  // Jadwal mengikuti lokasi baru (mode standar: dzuhur WS 11:21)
  await expect(page.getByText('11:21', { exact: true })).toBeVisible()

  // Mode istiwa memakai WIs hasil konversi: dzuhur 12:04 (bukan hardcode 12:03)
  await page.getByRole('button', { name: "Waktu Istiwa'" }).click()
  await expect(page.getByText('12:04', { exact: true })).toBeVisible()
})
