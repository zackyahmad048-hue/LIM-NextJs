# Organization Database

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan struktur database pada Domain Organization.

Domain Organization menjadi sumber utama data organisasi yang digunakan oleh seluruh domain dalam LIM Digital Platform.

---

# Overview

Domain Organization menyimpan struktur organisasi, wilayah, cabang, bidang, jabatan, kepengurusan, dan periode kepengurusan.

Seluruh tabel mengikuti standar database LIM Digital Platform.

---

# Entity Relationship

```text id="orgdb01"
Organization
      │
      ├──────┐
      │      │
      ▼      ▼
 Region   Department
      │          │
      ▼          ▼
 Branch     Position
      │          │
      └────┐ ┌───┘
           ▼ ▼
      Management
           │
           ▼
 Management Period
```

---

# Main Tables

## organization

Menyimpan data organisasi.

| Field     | Type      | Description       |
| --------- | --------- | ----------------- |
| id        | UUID      | Primary Key       |
| name      | String    | Nama Organisasi   |
| shortName | String    | Singkatan         |
| logo      | String    | Logo              |
| address   | Text      | Alamat            |
| phone     | String    | Nomor Telepon     |
| email     | String    | Email             |
| website   | String    | Website           |
| status    | Enum      | Active / Inactive |
| createdAt | Timestamp | Dibuat            |
| updatedAt | Timestamp | Diubah            |
| deletedAt | Timestamp | Soft Delete       |

---

## region

Menyimpan referensi wilayah.

| Field    | Type   |
| -------- | ------ |
| id       | UUID   |
| province | String |
| regency  | String |
| district | String |
| village  | String |

---

## branch

Menyimpan data cabang organisasi.

| Field          | Type      |
| -------------- | --------- |
| id             | UUID      |
| organizationId | UUID      |
| regionId       | UUID      |
| name           | String    |
| code           | String    |
| address        | Text      |
| status         | Enum      |
| createdAt      | Timestamp |
| updatedAt      | Timestamp |
| deletedAt      | Timestamp |

---

## department

Menyimpan bidang atau divisi organisasi.

| Field          | Type    |
| -------------- | ------- |
| id             | UUID    |
| organizationId | UUID    |
| name           | String  |
| description    | Text    |
| sortOrder      | Integer |

---

## position

Menyimpan jabatan.

| Field        | Type    |
| ------------ | ------- |
| id           | UUID    |
| departmentId | UUID    |
| name         | String  |
| level        | Integer |
| sortOrder    | Integer |

---

## management_period

Menyimpan periode kepengurusan.

| Field     | Type   |
| --------- | ------ |
| id        | UUID   |
| name      | String |
| startDate | Date   |
| endDate   | Date   |
| status    | Enum   |

---

## management

Menyimpan data pengurus.

| Field      | Type |
| ---------- | ---- |
| id         | UUID |
| userId     | UUID |
| branchId   | UUID |
| positionId | UUID |
| periodId   | UUID |
| startDate  | Date |
| endDate    | Date |
| status     | Enum |

---

# Relationships

| Source            | Relation | Target     |
| ----------------- | -------- | ---------- |
| Organization      | 1 : N    | Branch     |
| Organization      | 1 : N    | Department |
| Region            | 1 : N    | Branch     |
| Department        | 1 : N    | Position   |
| Branch            | 1 : N    | Management |
| Position          | 1 : N    | Management |
| Management Period | 1 : N    | Management |
| User              | 1 : N    | Management |

---

# Indexes

Index dibuat pada:

```text id="orgdb02"
organization.name

branch.code

branch.name

position.name

management_period.status

management.userId
```

---

# Constraints

## Organization

- Nama wajib unik.

---

## Branch

- Nama wajib.
- Kode wajib unik.

---

## Department

- Nama wajib unik dalam satu Organization.

---

## Position

- Nama wajib.
- Berada pada satu Department.

---

## Management Period

- Hanya satu periode berstatus Active.

---

## Management

- Position wajib ada.
- Branch wajib ada.
- Period wajib ada.

---

# Soft Delete

Menggunakan Soft Delete:

- organization
- branch
- department
- position
- management

Tidak diperbolehkan Hard Delete melalui aplikasi.

---

# Status Enum

## Organization

```text id="orgdb03"
Active

Inactive
```

---

## Management Period

```text id="orgdb04"
Upcoming

Active

Completed
```

---

## Management

```text id="orgdb05"
Active

Inactive
```

---

# Database Rules

- Organization menjadi referensi utama.
- Branch harus berada pada Region.
- Position harus berada pada Department.
- Management harus berada pada Period.
- Data yang masih digunakan tidak dapat dihapus.
- Seluruh perubahan menggunakan Repository Pattern.

---

# Future Tables

Versi berikutnya dapat menambahkan:

```text id="orgdb06"
organization_setting

organization_document

organization_history

organization_logo

organization_attachment
```

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
- Hanya terdapat satu periode aktif.
- Seluruh Foreign Key valid.
- Seluruh akses database menggunakan Repository Pattern.
