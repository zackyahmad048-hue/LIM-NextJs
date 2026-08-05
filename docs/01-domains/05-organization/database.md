# Organization Database

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 2.0

**Status:** Draft

---

# Purpose

Dokumen ini mendefinisikan skema database untuk Domain Organization.

Database menyimpan seluruh data organisasi, cabang, kepengurusan (pengurus pusat, pengurus wilayah, pengurus cabang), dan anggota.

---

# Entities

## organization

Menyimpan profil organisasi LIM.

| Field        | Type   | Description               |
| ------------ | ------ | ------------------------- |
| id           | UUID   | Primary Key               |
| name         | String | Nama organisasi           |
| short_name   | String | Singkatan (opsional)      |
| logo         | String | Path logo (opsional)      |
| address      | Text   | Alamat organisasi         |
| phone        | String | Telepon (opsional)        |
| email        | String | Email (opsional)          |
| website      | String | Website (opsional)        |
| status       | Enum   | Active / Inactive         |
| created_at   | Timestamp | Dibuat                 |
| updated_at   | Timestamp | Diubah                 |
| deleted_at   | Timestamp | Soft Delete            |

---

## branch

Menyimpan data cabang organisasi (tingkat kabupaten/kota).

| Field          | Type   | Description                    |
| -------------- | ------ | ------------------------------ |
| id             | UUID   | Primary Key                    |
| organization_id | UUID  | Foreign Key → organization     |
| name           | String | Nama cabang                    |
| province       | String | Provinsi                       |
| regency        | String | Kabupaten/Kota                 |
| address        | Text   | Alamat cabang (opsional)       |
| status         | Enum   | Active / Inactive              |
| created_at     | Timestamp | Dibuat                      |
| updated_at     | Timestamp | Diubah                      |
| deleted_at     | Timestamp | Soft Delete                 |

---

## central_board

Menyimpan data Pengurus Pusat (Central Board).

| Field        | Type   | Description                          |
| ------------ | ------ | ------------------------------------ |
| id           | UUID   | Primary Key                          |
| user_id      | UUID   | Foreign Key → users                  |
| organization_id | UUID | Foreign Key → organization           |
| role         | Enum   | `central`                            |
| period       | String | Periode kepengurusan (2024-2029)     |
| status       | Enum   | Active / Inactive                    |
| created_at   | Timestamp | Dibuat                            |
| updated_at   | Timestamp | Diubah                            |
| deleted_at   | Timestamp | Soft Delete                       |

---

## regional_board

Menyimpan data Pengurus Wilayah (Regional Board — tingkat provinsi).

| Field        | Type   | Description                          |
| ------------ | ------ | ------------------------------------ |
| id           | UUID   | Primary Key                          |
| user_id      | UUID   | Foreign Key → users                  |
| organization_id | UUID | Foreign Key → organization           |
| province     | String | Provinsi                             |
| role         | Enum   | `regional`                           |
| period       | String | Periode kepengurusan (2024-2029)     |
| status       | Enum   | Active / Inactive                    |
| created_at   | Timestamp | Dibuat                            |
| updated_at   | Timestamp | Diubah                            |
| deleted_at   | Timestamp | Soft Delete                       |

---

## branch_board

Menyimpan data Pengurus Cabang (Branch Board — tingkat kabupaten/kota).

| Field        | Type   | Description                          |
| ------------ | ------ | ------------------------------------ |
| id           | UUID   | Primary Key                          |
| user_id      | UUID   | Foreign Key → users                  |
| organization_id | UUID | Foreign Key → organization           |
| branch_id    | UUID   | Foreign Key → branch                 |
| role         | Enum   | `branch`                             |
| period       | String | Periode kepengurusan (2024-2029)     |
| status       | Enum   | Active / Inactive                    |
| created_at   | Timestamp | Dibuat                            |
| updated_at   | Timestamp | Diubah                            |
| deleted_at   | Timestamp | Soft Delete                       |

---

## member

Menyimpan data Anggota organisasi.

| Field        | Type   | Description                          |
| ------------ | ------ | ------------------------------------ |
| id           | UUID   | Primary Key                          |
| user_id      | UUID   | Foreign Key → users                  |
| organization_id | UUID | Foreign Key → organization           |
| branch_id    | UUID   | Foreign Key → branch                 |
| period       | String | Periode kepengurusan (2024-2029)     |
| status       | Enum   | Active / Inactive                    |
| created_at   | Timestamp | Dibuat                            |
| updated_at   | Timestamp | Diubah                            |
| deleted_at   | Timestamp | Soft Delete                       |

---

# Relationships

| Source            | Relation | Target     |
| ----------------- | -------- | ---------- |
| Organization      | 1 : N    | Branch     |
| Organization      | 1 : N    | Central Board |
| Organization      | 1 : N    | Regional Board |
| Organization      | 1 : N    | Branch Board |
| Organization      | 1 : N    | Member     |
| Branch            | 1 : N    | Branch Board |
| Branch            | 1 : N    | Member     |
| User              | 1 : N    | Central Board |
| User              | 1 : N    | Regional Board |
| User              | 1 : N    | Branch Board |
| User              | 1 : N    | Member     |

---

# Indexes

Index dibuat pada:

```text id="orgdb01"
organization.name

branch.code

branch.name

central_board.user_id

regional_board.user_id

branch_board.user_id

member.user_id

member.branch_id
```

---

# Constraints

## Organization

- Nama wajib unik.

## Branch

- Nama wajib.
- Kode wajib unik.
- Harus berada pada satu Organization.

## Central Board

- User wajib.
- Organization wajib.
- Role wajib (`central`).
- Periode wajib (`2024-2029`).

## Regional Board

- User wajib.
- Organization wajib.
- Province wajib.
- Role wajib (`regional`).
- Periode wajib (`2024-2029`).

## Branch Board

- User wajib.
- Organization wajib.
- Branch wajib.
- Role wajib (`branch`).
- Periode wajib (`2024-2029`).

## Member

- User wajib.
- Organization wajib.
- Branch wajib.
- Periode wajib (`2024-2029`).

---

# Soft Delete

Menggunakan Soft Delete:

- organization
- branch
- central_board
- regional_board
- branch_board
- member

Tidak diperbolehkan Hard Delete melalui aplikasi.

---

# Status Enum

## Organization & Branch

```text id="orgdb02"
Active

Inactive
```

## Central Board, Regional Board, Branch Board, Member

```text id="orgdb03"
Active

Inactive
```

---

# Database Rules

- Organization menjadi referensi utama.
- Branch harus berada pada satu Organization.
- Central Board tidak terikat Branch.
- Regional Board menunjuk ke provinsi.
- Branch Board harus berada pada satu Branch.
- Member harus berada pada satu Branch.
- Satu User dapat menjadi anggota lebih dari satu Board apabila diizinkan oleh organisasi.
- Data yang masih digunakan tidak dapat dihapus.
- Seluruh perubahan menggunakan Repository Pattern.

---

# Period

Periode kepengurusan bersifat tetap: **2024–2029**.

Disimpan sebagai setting organisasi (`org:period`).

---

# Related Documents

- README.md
- business-rules.md
- workflow.md
- api.md
- permissions.md
- validation.md
- ui.md
- roadmap.md

---

# Acceptance Criteria

Database Organization dianggap selesai apabila:

- Struktur organisasi dapat direpresentasikan dengan benar.
- Relasi antar tabel konsisten.
- Pengurus Pusat, Pengurus Wilayah, Pengurus Cabang, dan Anggota dapat dikelola.
- Hanya terdapat satu periode aktif (2024-2029).
- Seluruh Foreign Key valid.
- Seluruh akses database menggunakan Repository Pattern.