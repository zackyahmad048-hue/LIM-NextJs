# ADR-014: Bukti Verifikasi Surat Adalah Metadata, Bukan Dokumen

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Proposed

**Date:** 2026-10-14

---

# Context

Halaman publik Verifikasi Surat (`app/verifikasi/surat/`) memverifikasi keaslian
Surat Keluar memakai Nomor Surat itu sendiri sebagai kode
(`application/signing.service.ts:44` menetapkan `verificationCode = fullNumber`,
dan `domain/letter-link.ts:7` menanamkannya ke QR). Kode itu, karena sama dengan
Nomor Surat, **tercetak di permukaan surat kertas yang beredar** dan berlaku
selamanya.

Halaman ini sekaligus menampilkan pratinjau dokumen lampiran lengkap, disajikan
lewat rute publik `app/api/v1/verifikasi/surat/[...kode]/route.ts` yang hanya
meminta `?preview=1` dan mengirim `Cache-Control: public, s-maxage=86400`.
Penghalangnya satu: tanda air "Salinan Digital" pada hasil render. Isi surat
tidak diblur, tidak dipotong, dan tidak kedaluwarsa.

Halaman juga menampilkan lencana "Surat Sah" untuk **setiap** surat yang
ditemukan, tanpa memandang status; pencarian hanya menyaring `deletedAt`
(`infrastructure/outgoing-mail.repository.ts:60`). Karena transisi
`SENT → DRAFT` sah menurut `domain/status-transition.ts`, surat yang ditarik
kembali tetap menyandang kodenya dan tetap dinyatakan "Surat Sah" oleh halaman
ini.

---

# Decision

**Bukti verifikasi adalah metadata surat, bukan dokumennya.** Halaman Verifikasi
Surat menyatakan tiga hasil, dan hanya tiga:

```text
Sah            → status SENT atau ARCHIVED
Tidak Berlaku   → status DRAFT (surat ditarik kembali)
Tidak Ditemukan → kode tak dikenal, atau surat sudah dihapus lunak
```

Pratinjau dokumen **dihapus** dari halaman publik. Rute API pratinjau dihapus
karena menjadi kode mati. Isi surat resmi hanya keluar lewat sekretariat.

Lencana "Surat Sah" berhenti menjadi lencana universal: ia hanya muncul pada
hasil `Sah`.

---

# Rationale

Yang dijawab halaman ini adalah pertanyaan "nomor ini benar milik LIM, tentang
apa, dan masih berlaku?". Jawaban itu lengkap dari metadata: Nomor Surat,
perihal, penerima, tanggal, dan penanda tangan. Dokumen lampiran tidak
menambah sedikit pun kepastian atas pertanyaan tersebut — ia hanya menambah isi.

Sementara biayanya tidak sepadan. Kode verifikasi tidak dapat dicabut, tidak
dapat dirotasi, dan tertulis di setiap fotokopi surat yang pernah beredar.
Menjadikannya tiket akses seumur hidup ke isi dokumen resmi organisasi berarti
kebocoran yang tak dapat ditarik kembali, sementara manfaatnya nol terhadap
pertanyaan yang sebenarnya diajukan pembaca.

Menyembunyikan pratinjau di balik tombol ("lipat, jangan hilangkan") sudah
dipertimbangkan dan ditolak: itu mengubah kebocoran menjadi pertanyaan tata
letak, bukan memperbaikinya.

---

# Alternatives Considered

## Pratinjau tetap terbuka, sekadar dirapikan
Mempertahankan isi surat dapat ditarik siapa pun yang melihat satu lembar surat
kertas. Ditolak.

## Pratinjau dilipat di balik tombol "Lihat dokumen asli"
Tampak lebih aman tanpa menjadi lebih aman; satu klik tetap membuka semuanya,
dan kode tetap tak dapat dicabut. Ditolak karena menyamarkan masalah.

## Pratinjau diberi masa berlaku atau rate limit
Batas waktu pada tautan tidak menyelesaikan apa pun: kodenya, bukan tautannya,
yang menjadi rahasia, dan kode tertulis di dokumen fisik. Rate limit
memperlambat enumerasi tetapi tidak menutupnya. Ditunda menjadi tiket
tersendiri (lihat Consequences), bukan alasan mempertahankan pratinjau.

## Hapus lencana "Surat Sah" sepenuhnya
Ditolak; pembaca memang perlu satu jawaban tegas di layar. Yang diperbaiki
adalah syaratnya, bukan keberadaannya.

---

# Consequences

- `app/api/v1/verifikasi/surat/[...kode]/route.ts` dihapus. `preview.service`
  tetap ada karena masih dipakai `qr-editor.service`.
- Halaman tidak lagi menampilkan isi dokumen; salinan resmi ditempuh lewat
  sekretariat (halaman mengarahkan ke `/kontak`).
- **Risiko yang diterima sadar:** Nomor Surat dapat ditebak
  (templat `{seq}/{level}/{category}/{bulan}/{tahun}`), sehingga perihal dan
  nama penerima seluruh surat yang pernah terbit dapat dikumpulkan dengan
  menyapu ribuan nomor. Rate limit belum ada di repo ini. Ini dicatat sebagai
  tiket lanjutan, bukan bagian dari perubahan ini.
- `docs/05-decisions/README.md` tidak lagi mendaftar lengkap sejak ADR-011;
  daftarnya perlu diselaraskan terpisah.
- Audit aksesibilitas (`tests/accessibility/axe.scan.test.ts`) menambahkan rute
  verifikasi agar permukaan ini tidak luput dari pemindaian.

---

# Related Decisions

- ADR-006 Storage Strategy (penyimpanan lampiran)
- ADR-008 API Standard (rute publik)
- ADR-012 Siklus Surat Masuk Dua Status (pola perbaikan dokumentasi serupa)

---

# Acceptance Criteria

- Hasil `Sah` hanya untuk status `SENT` dan `ARCHIVED`.
- Surat `DRAFT` yang kodenya masih dipegang dinyatakan **Tidak Berlaku** dengan
  nada netral, dan kartu identitasnya tetap ditampilkan agar pembaca dapat
  mencocokkan nomornya.
- Halaman tidak lagi memuat pratinjau dokumen maupun panggilan ke rute
  pratinjau.
- Rute `app/api/v1/verifikasi/surat/[...kode]/route.ts` hilang dari repo.
- `GLOSSARY.md` memuat istilah "Surat Tidak Berlaku" dan "Verifikasi Surat"
  yang telah diketatkan.
- Halaman tidak diindeks mesin pencari (`noindex, nofollow`).
- Tidak ada istilah internal pada tampilan: "Status Terkini" dan kode kategori
  mentah tidak muncul.

---

# Status

**Proposed**
