# 02: Prayer Widget Mobile + Clock WIS

**What to build:** Widget shalat responsive di mobile (tidak menabrak layar) + jam real-time yang menyesuaikan mode (Standar/WIS).

**Blocked by:** None (can start immediately)

**Status:** resolved

## Acceptance criteria

- [ ] Container max-width: `max-w-[18rem]` mobile, `sm:max-w-[20rem]`, `lg:max-w-88`
- [ ] Padding: `px-3 py-3` mobile → `sm:px-5 sm:py-4` desktop
- [ ] Font sizes scaled: label `text-[10px] sm:text-[11px]`, clock `text-lg sm:text-xl`
- [ ] Clock HH:MM:SS ditampilkan di bawah tanggal (ikon Clock + `formatTime(dec, true)`)
- [ ] Mode Standar: clock menunjukkan waktu lokal timezone (`dateToDecimalHoursInZone`)
- [ ] Mode WIS: clock menunjukkan waktu astronomial (`(currentDec - transitStandard + 36) % 24`)
- [ ] Widget `rounded-xl` (konsisten dengan design system)
