# Database Reference

**Project:** LIM Digital Platform

**Folder:** `06-references`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjadi referensi utama implementasi database pada LIM Digital Platform.

Dokumen ini melengkapi standar Database dengan menyediakan ringkasan konvensi penamaan, tipe data, relasi, indexing, migration, transaction, serta praktik terbaik yang digunakan oleh seluruh domain.

---

# Database Engine

Database utama yang digunakan:

```text id="dbref01"
PostgreSQL
```

Cache:

```text id="dbref02"
Redis
```

Object Storage digunakan untuk file dan media.

---

# Naming Convention

## Table

Gunakan:

```text id="dbref03"
snake_case
```

Contoh:

```text id="dbref04"
users

organizations

programs

letters

knowledge_articles

audit_logs
```

---

## Column

Gunakan:

```text id="dbref05"
snake_case
```

Contoh:

```text id="dbref06"
created_at

updated_at

deleted_at

organization_id

certificate_number
```

---

## Primary Key

Gunakan:

```text id="dbref07"
id
```

---

## Foreign Key

Format:

```text id="dbref08"
entity_id
```

Contoh:

```text id="dbref09"
user_id

program_id

organization_id
```

---

# Standard Columns

Setiap tabel minimal memiliki:

```text id="dbref10"
id

created_at

updated_at
```

Apabila mendukung Soft Delete:

```text id="dbref11"
deleted_at
```

Audit tambahan (opsional):

```text id="dbref12"
created_by

updated_by

deleted_by
```

---

# Data Types

| Purpose     | Recommended Type |
| ----------- | ---------------- |
| ID          | UUID / BIGINT    |
| Name        | VARCHAR          |
| Description | TEXT             |
| Boolean     | BOOLEAN          |
| Number      | INTEGER / BIGINT |
| Decimal     | NUMERIC          |
| Date        | DATE             |
| Date Time   | TIMESTAMP        |
| JSON        | JSONB            |
| File Size   | BIGINT           |

---

# Relationships

Relationship yang digunakan:

- One-to-One
- One-to-Many
- Many-to-Many

Foreign Key wajib digunakan untuk menjaga integritas data.

---

# Indexing

Index dibuat untuk:

- Foreign Key
- Frequently Queried Column
- Search Field
- Unique Field

Contoh:

```text id="dbref13"
email

username

certificate_number

created_at
```

---

# Constraints

Gunakan:

- PRIMARY KEY
- FOREIGN KEY
- UNIQUE
- NOT NULL
- CHECK Constraint

Constraint menjadi lapisan terakhir validasi data.

---

# Transactions

Transaction digunakan pada:

- Create Program
- Letter Approval
- Certificate Generation
- Role Assignment
- Archive Process

Seluruh operasi harus memenuhi prinsip:

```text id="dbref14"
ACID
```

---

# Migration

Migration digunakan untuk:

- Membuat tabel.
- Mengubah struktur.
- Menambah Index.
- Menambah Constraint.

Migration harus:

- Versioned.
- Repeatable.
- Dapat di-roll back.

---

# Seed Data

Seed digunakan untuk:

- Role
- Permission
- Settings
- Default Configuration
- Reference Data

Seed tidak digunakan untuk data transaksi.

---

# Soft Delete

Entity tertentu menggunakan Soft Delete.

Kolom:

```text id="dbref15"
deleted_at
```

Data historis tidak dihapus secara permanen kecuali melalui proses administrasi khusus.

---

# Performance Guidelines

- Gunakan Index secara tepat.
- Hindari SELECT *.
- Gunakan Pagination.
- Hindari N+1 Query.
- Optimalkan Query Plan.
- Gunakan Batch Operation bila memungkinkan.

---

# Backup & Recovery

Database wajib:

- Backup harian.
- Full Backup mingguan.
- Point-in-Time Recovery.
- Restore Test berkala.

---

# Security

Database wajib:

- Tidak dapat diakses publik.
- Menggunakan Least Privilege.
- Password terenkripsi.
- Backup terenkripsi.
- Audit aktivitas administratif.

---

# Best Practices

- Gunakan UUID untuk sistem terdistribusi (jika diperlukan).
- Hindari perubahan schema langsung di Production.
- Dokumentasikan setiap Migration.
- Gunakan Transaction untuk operasi multi-tabel.
- Pantau Slow Query secara berkala.

---

# Related Documents

- README.md
- glossary.md
- coding-reference.md
- api-reference.md
- external-references.md

---

# Acceptance Criteria

- Seluruh database mengikuti standar penamaan.
- Migration terdokumentasi.
- Index dan Constraint diterapkan dengan benar.
- Backup dan Security memenuhi standar.
- Database Reference menjadi acuan seluruh implementasi database LIM Digital Platform.
