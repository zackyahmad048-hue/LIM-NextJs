# Data Privacy & Compliance (UU PDP)

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Document:** `data-privacy.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan strategi privasi data dan kepatuhan terhadap **Undang-Undang Pelindungan Data Pribadi (UU PDP)** pada LIM Digital Platform.

---

# Principles

Seluruh pengelolaan data pribadi harus mematuhi prinsip-prinsip berikut:

* **Legality:** Pengolahan data memiliki dasar hukum yang sah.
* **Purpose Limitation:** Data hanya digunakan untuk tujuan yang telah ditentukan.
* **Data Minimization:** Hanya mengumpulkan data yang diperlukan.
* **Accuracy:** Data harus akurat dan terkini.
* **Storage Limitation:** Data tidak disimpan lebih lama dari yang diperlukan.
* **Integrity & Confidentiality:** Data harus aman dari akses tidak sah.
* **Accountability:** Dapat menunjukkan kepatuhan.

---

# Soft Delete vs Hard Delete

## Soft Delete (Default)

Data operasional menggunakan `deleted_at` timestamp:

* Jadwal sholat
* Sertifikat
* Program
* Surat
* Dokumen CMS

```text
deleted_at = NULL      → Aktif
deleted_at = NOT NULL  → Terhapus (soft delete)
```

## Hard Delete (Right to be Forgotten)

Jika pengguna meminta penghapusan akun (sesuai hak UU PDP):

* Lakukan **Hard Delete** pada data PII (Personal Identifiable Information), atau
* Lakukan **Data Anonymization**:
  * Nama → "Deleted User"
  * NIK → dihapus
  * Email → dihapus
  * Nomor HP → dihapus

Relasi database (Foreign Key) tetap utuh namun data pribadi musnah.

---

# Personal Data Classification

| Category | Data Types | Sensitivity |
|----------|-----------|-------------|
| Identitas | Nama, NIK, Tempat Lahir, Tanggal Lahir | Tinggi |
| Kontak | Email, Nomor HP, Alamat | Tinggi |
| Keagamaan | Agama, Status Haji/Umrah | Sedang |
| Organisasi | Jabatan, Periode Kepengurusan | Rendah |
| Akun | Username, Password Hash, Role | Tinggi |
| Aktivitas | Login history, Audit logs | Sedang |

---

# Consent

Sebelum mengumpulkan data pribadi:

* Sediakan Privacy Policy yang jelas.
* Minta consent eksplisit dari pengguna.
* Catat timestamp consent.
* Izinkan penarikan consent.

---

# Data Retention

| Data Type | Retention Period | Action After Expiry |
|-----------|-----------------|---------------------|
| User Account | Selama akun aktif | Hard delete setelah 30 hari inactive |
| Session | 7 hari (admin), 1 hari (public) | Auto delete |
| Audit Log | 5 tahun | Archive |
| Email Verification | 24 jam | Auto delete |
| Password Reset | 1 jam | Auto delete |
| CMS Content | Selama aktif | Soft delete |

---

# Audit Trails

Perubahan pada data sensitif wajib mencatat:

* **Actor ID:** Siapa yang melakukan perubahan.
* **IP Address:** Dari mana perubahan dilakukan.
* **Timestamp:** Kapan perubahan dilakukan.
* **Action:** Apa yang diubah.
* **Before/After:** Nilai sebelum dan sesudah perubahan.

Data sensitif yang wajib di-audit:

* User management
* Permission changes
* Data keuangan
* Password changes
* Login attempts

---

# Data Security

* Enripsi data at rest menggunakan AES-256.
* Enripsi data in transit menggunakan TLS 1.3.
* Password di-hash menggunakan bcrypt.
* Token autentikasi menggunakan JWT dengan expiry.
* API keys disimpan di environment variables.

---

# Data Subject Rights

UU PDP memberikan hak kepada subjek data:

| Right | Description | Implementation |
|-------|-------------|----------------|
| Right to Know | Mengetahui data apa yang dikumpulkan | Privacy Policy + API |
| Right to Access | Mendapatkan salinan data | Export feature |
| Right to Correction | Memperbaiki data | Edit profile |
| Right to Deletion | Menghapus data | Account deletion |
| Right to Portability | Memindahkan data | Data export |
| Right to Object | Menolak pengolahan | Opt-out feature |

---

# Breach Response

Jika terjadi pelanggaran keamanan data:

```text
Deteksi Pelanggaran
      |
Evaluasi Dampak
      |
Notifikasi Kewenangan (72 jam)
      |
Notifikasi Pihak Terdampak
      |
Remediation
      |
Post-Mortem
```

---

# Related Documents

* `README.md` - Architecture overview.
* `architecture-overview.md` - High level architecture.
* `dependency-rules.md` - Dependency rules.
* `../01-domains/01-authentication/` - Authentication domain.

---

# Acceptance Criteria

* Seluruh data pribadi terklasifikasi dengan benar.
* Soft delete terimplementasi sebagai default.
* Hard delete / anonymization tersedia untuk Right to be Forgotten.
* Audit trails tercatat untuk data sensitif.
* Data retention policy terimplementasi.
* Privacy Policy tersedia dan dapat diakses.
* Consent mechanism terimplementasi.
