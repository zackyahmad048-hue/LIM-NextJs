# ADR-009: Validation Strategy

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-07-14

---

# Context

LIM Digital Platform memproses berbagai jenis data dari pengguna, sistem internal, dan layanan eksternal.

Apabila validasi dilakukan secara tidak konsisten, maka dapat menyebabkan:

- Data tidak valid tersimpan.
- Business Rules dilanggar.
- Celah keamanan.
- Perilaku sistem yang tidak konsisten.
- Sulit melakukan debugging.

Diperlukan strategi validasi yang seragam untuk seluruh aplikasi.

---

# Decision

LIM Digital Platform menerapkan **Multi-Layer Validation Strategy**.

Validasi dilakukan pada beberapa lapisan sistem.

```text id="adr00901"
Client Validation

↓

API Validation

↓

Application Validation

↓

Domain Validation

↓

Database Constraint
```

Tidak ada satu lapisan pun yang menjadi satu-satunya mekanisme validasi.

---

# Rationale

Pendekatan ini dipilih karena:

- Mencegah data tidak valid masuk ke sistem.
- Menjaga integritas Business Rules.
- Mengurangi risiko keamanan.
- Memberikan pengalaman pengguna yang lebih baik.
- Mendukung prinsip Defense in Depth.

---

# Validation Layers

## Client Validation

Digunakan untuk:

- Required Field
- Format
- Panjang Input
- User Experience

Client Validation **tidak dapat dipercaya** sebagai satu-satunya validasi.

---

## API Validation

Dilakukan pada:

- Request Body
- Query Parameter
- Path Parameter
- Header

Meliputi:

- Required Field
- Data Type
- Format
- Range
- Enum
- Pagination

---

## Application Validation

Application Layer memvalidasi:

- Authorization
- Permission
- Workflow
- Business Preconditions

Contoh:

- User memiliki Role yang sesuai.
- Resource masih aktif.
- Status memungkinkan aksi tertentu.

---

## Domain Validation

Merupakan validasi utama.

Domain bertanggung jawab terhadap:

- Business Rules.
- Entity Invariant.
- Aggregate Consistency.
- Value Object Validation.

Business Rules **tidak boleh** hanya bergantung pada API Validation.

---

## Database Validation

Menggunakan:

- Primary Key
- Foreign Key
- Unique Constraint
- Check Constraint
- Not Null Constraint

Database menjadi lapisan pertahanan terakhir terhadap integritas data.

---

# Error Handling

Seluruh Validation Error menggunakan format yang konsisten.

Minimal berisi:

```text id="adr00902"
success

message

errors

code
```

Validation Error menggunakan HTTP Status:

```text id="adr00903"
422 Unprocessable Entity
```

---

# Alternatives Considered

## Client Validation Only

Kelebihan:

- Cepat.
- Responsif.

Kekurangan:

- Mudah dilewati.
- Tidak aman.

---

## Database Validation Only

Kelebihan:

- Menjaga integritas data.

Kekurangan:

- Terlambat.
- Pesan error kurang informatif.
- Tidak melindungi Business Rules.

---

## Multi-Layer Validation (Chosen)

Kelebihan:

- Aman.
- Konsisten.
- Mudah dipelihara.
- Mendukung Clean Architecture.

Kekurangan:

- Membutuhkan implementasi pada beberapa layer.

---

# Consequences

Keuntungan:

- Integritas data terjaga.
- Business Rules terlindungi.
- Error lebih mudah dipahami.
- Risiko bug berkurang.

Konsekuensi:

- Validasi dapat terjadi di beberapa lapisan.
- Membutuhkan konsistensi implementasi.
- Dokumentasi validasi harus selalu diperbarui.

---

# Validation Rules

Validasi wajib dilakukan untuk:

- Input API
- Permission
- Workflow
- Business Rules
- File Upload
- Authentication
- Authorization
- Domain Entity

---

# Related Decisions

- ADR-001 Domain Driven Design
- ADR-002 Clean Architecture
- ADR-004 Role-Based Access Control
- ADR-008 API Standard

---

# References

- OWASP Input Validation Cheat Sheet
- Clean Architecture — Robert C. Martin
- Architecture Documentation (`02-architecture/clean-architecture.md`)

---

# Status

**Accepted**

---

# Acceptance Criteria

- Seluruh input divalidasi pada layer yang sesuai.
- Business Rules divalidasi di Domain Layer.
- Validation Error menggunakan format standar.
- Database Constraint melindungi integritas data.
- Validation Strategy menjadi standar implementasi LIM Digital Platform.
