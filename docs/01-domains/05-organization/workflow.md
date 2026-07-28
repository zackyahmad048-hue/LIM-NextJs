# Organization Workflow

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan alur proses (workflow) pada Domain Organization.

Workflow menjadi acuan implementasi pengelolaan organisasi, wilayah, cabang, jabatan, kepengurusan, dan periode kepengurusan.

---

# Overview

Domain Organization merupakan pusat referensi struktur organisasi.

Seluruh perubahan struktur organisasi dilakukan melalui domain ini dan akan digunakan oleh domain lain seperti Program, Secretariat, Letter, dan Certificate.

---

# Organization Lifecycle

```text id="orgwf01"
Create Organization

↓

Configure Structure

↓

Create Branch

↓

Create Department

↓

Create Position

↓

Assign Management

↓

Activate Organization
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

Assign Region

↓

Save

↓

Audit Log
```

---

# Department Workflow

```text id="orgwf04"
Administrator

↓

Create Department

↓

Validation

↓

Save

↓

Audit Log
```

---

# Position Workflow

```text id="orgwf05"
Administrator

↓

Create Position

↓

Assign Department

↓

Validation

↓

Save

↓

Audit Log
```

---

# Management Assignment Workflow

```text id="orgwf06"
Select User

↓

Select Branch

↓

Select Position

↓

Set Management Period

↓

Validation

↓

Save

↓

Audit Log
```

---

# Management Period Workflow

```text id="orgwf07"
Create Period

↓

Set Start Date

↓

Set End Date

↓

Validation

↓

Activate Period

↓

Audit Log
```

Apabila terdapat periode yang masih aktif, sistem harus menonaktifkannya terlebih dahulu sebelum mengaktifkan periode baru.

---

# Organization Update Workflow

```text id="orgwf08"
Select Organization

↓

Update Data

↓

Validation

↓

Save

↓

Audit Log
```

---

# Branch Update Workflow

```text id="orgwf09"
Select Branch

↓

Update Information

↓

Validation

↓

Save
```

---

# Position Update Workflow

```text id="orgwf10"
Select Position

↓

Update Information

↓

Validation

↓

Save
```

---

# Deactivate Workflow

```text id="orgwf11"
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

```text id="orgwf12"
Request Organization Data

↓

Permission Check

↓

Load Organization

↓

Return Result
```

Workflow ini digunakan oleh:

* Program
* Secretariat
* Letter
* Certificate

---

# Error Workflow

```text id="orgwf13"
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

```text id="orgwf14"
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

* Seluruh perubahan melalui proses validasi.
* Seluruh perubahan memerlukan Permission.
* Seluruh perubahan dicatat pada Audit Log.
* Data organisasi menjadi referensi resmi domain lain.
* Tidak diperbolehkan menghapus data yang masih digunakan.

---

# Related Documents

* README.md
* business-rules.md
* database.md
* api.md
* permissions.md
* validation.md
* ui.md
* roadmap.md

---

# Acceptance Criteria

Workflow Organization dianggap selesai apabila:

* Organisasi dapat dibuat dan diperbarui.
* Cabang, Bidang, dan Jabatan mengikuti alur yang ditentukan.
* Pengurus dapat ditetapkan pada periode aktif.
* Seluruh perubahan melalui validasi, permission, dan audit.
* Data dapat digunakan oleh domain lain sebagai referensi resmi.
