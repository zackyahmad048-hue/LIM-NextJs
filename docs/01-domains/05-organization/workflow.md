# Organization Workflow

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 2.0

**Status:** Draft

---

# Purpose

Dokumen ini menjelaskan alur proses (workflow) pada Domain Organization.

Workflow menjadi acuan implementasi pengelolaan organisasi, cabang, kepengurusan (pengurus pusat, pengurus wilayah, pengurus cabang), dan data anggota.

---

# Overview

Domain Organization merupakan pusat referensi struktur kepengurusan organisasi LIM berdasarkan AD/ART.

Seluruh perubahan data kepengurusan dilakukan melalui domain ini dan akan digunakan oleh domain lain seperti Program, Secretariat, Letter, dan Certificate.

---

# Organization Lifecycle

```text id="orgwf01"
Create Organization

↓

Configure Branch

↓

Assign Central Board

↓

Assign Regional Board

↓

Assign Branch Board

↓

Add Member
```

---

# Create Organization Workflow

```text id="orgwf02"
Administrator

↓

Input Organization Data

↓

Validation

↓

Save Organization

↓

Audit Log
```

---

# Branch Workflow

```text id="orgwf03"
Administrator

↓

Create Branch

↓

Validation

↓

Assign Province & Regency

↓

Save

↓

Audit Log
```

---

# Central Board Workflow

```text id="orgwf04"
Administrator

↓

Select User

↓

Select Organization

↓

Validation

↓

Save

↓

Audit Log
```

---

# Regional Board Workflow

```text id="orgwf05"
Administrator

↓

Select User

↓

Select Organization

↓

Input Province

↓

Validation

↓

Save

↓

Audit Log
```

---

# Branch Board Workflow

```text id="orgwf06"
Administrator

↓

Select User

↓

Select Organization

↓

Select Branch

↓

Validation

↓

Save

↓

Audit Log
```

---

# Member Workflow

```text id="orgwf07"
Administrator

↓

Select User

↓

Select Organization

↓

Select Branch

↓

Validation

↓

Save

↓

Audit Log
```

---

# Update Workflow

```text id="orgwf08"
Select Data

↓

Update Information

↓

Validation

↓

Save

↓

Audit Log
```

---

# Deactivate Workflow

```text id="orgwf09"
Deactivate Organization Data

↓

Check Dependencies

↓

Soft Delete

↓

Audit Log
```

Data yang masih digunakan oleh domain lain tidak dapat dinonaktifkan.

---

# Organization Lookup Workflow

```text id="orgwf10"
Request Organization Data

↓

Permission Check

↓

Load Organization

↓

Return Result
```

Workflow ini digunakan oleh:

- Program
- Secretariat
- Letter
- Certificate

---

# Error Workflow

```text id="orgwf11"
Validation Failed

↓

Display Error

↓

Correct Data

↓

Save Again
```

---

# Permission Workflow

```text id="orgwf12"
User Request

↓

Authentication

↓

Authorization

↓

Permission Check

↓

Execute Action
```

---

# Workflow Rules

- Seluruh perubahan melalui proses validasi.
- Seluruh perubahan memerlukan Permission.
- Seluruh perubahan dicatat pada Audit Log.
- Data organisasi dan kepengurusan menjadi referensi resmi domain lain.
- Tidak diperbolehkan menghapus data yang masih digunakan.
- Periode kepengurusan bersifat tetap (2024–2029).

---

# Related Documents

- README.md
- business-rules.md
- database.md
- api.md
- permissions.md
- validation.md
- ui.md
- roadmap.md

---

# Acceptance Criteria

Workflow Organization dianggap selesai apabila:

- Organisasi dapat dibuat dan diperbarui.
- Cabang, Pengurus Pusat, Pengurus Wilayah, Pengurus Cabang, dan Anggota mengikuti alur yang ditentukan.
- Kepengurusan dapat ditetapkan pada periode tetap (2024-2029).
- Seluruh perubahan melalui validasi, permission, dan audit.
- Data dapat digunakan oleh domain lain sebagai referensi resmi.