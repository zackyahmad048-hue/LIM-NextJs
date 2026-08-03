# Authorization - Workflow

**Project:** LIM Digital Platform

**Domain:** Authorization

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan workflow untuk domain Authorization.

---

# Permission Check Workflow

``

1. User mengirim request
   |
2. Ambil token dari header
   |
3. Validasi session
   |
4. Ambil user dari session
   |
5. Ambil roles user
   |
6. Ambil permissions dari roles
   |
7. Cek apakah permission ada
   |
8. Jika ya: lanjutkan
   |
9. Jika tidak: tolak akses (403)
   ``

---

# Role Assignment Workflow

``

1. Admin membuka halaman user
   |
2. Admin memilih user
   |
3. Admin memilih role
   |
4. Sistem menugaskan role
   |
5. Role langsung berlaku
   ``

---

# Permission Assignment Workflow

``

1. Admin membuka halaman role
   |
2. Admin memilih role
   |
3. Admin memilih permissions
   |
4. Sistem menugaskan permissions
   |
5. Permissions langsung berlaku
   ``

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `api.md` - API endpoints.
