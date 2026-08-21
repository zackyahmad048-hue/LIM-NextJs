# Program Workflow

**Project:** LIM Digital Platform

**Domain:** Program

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan alur proses (Workflow) pada Domain Program.

Workflow menjadi acuan implementasi pengelolaan Program mulai dari perencanaan, pendaftaran, pelaksanaan, hingga penyelesaian kegiatan.

---

# Overview

Domain Program mengelola seluruh siklus hidup kegiatan organisasi.

Setiap perubahan status Program mengikuti alur yang telah ditetapkan dan tercatat pada Audit Log.

---

# Program Lifecycle

```text id="prgwf01"
Draft

↓

Published

↓

Registration Open

↓

Registration Closed

↓

On Going

↓

Completed

↓

Archived
```

Apabila diperlukan, Program dapat berubah menjadi **Cancelled** sebelum status **Completed**.

---

# Create Program Workflow

```text id="prgwf02"
Administrator

↓

Create Program

↓

Input Program Information

↓

Validation

↓

Save Draft

↓

Audit Log
```

---

# Publish Program Workflow

```text id="prgwf03"
Draft

↓

Validation

↓

Permission Check

↓

Published

↓

Audit Log
```

Program yang telah dipublikasikan dapat ditampilkan pada Website dan Mobile.

---

# Registration Workflow

```text id="prgwf04"
Published

↓

Open Registration

↓

Participant Register

↓

Validation

↓

Save Registration

↓

Confirmation
```

---

# Close Registration Workflow

```text id="prgwf05"
Registration Open

↓

Close Registration

↓

Registration Closed

↓

Audit Log
```

Setelah ditutup, peserta baru tidak dapat mendaftar.

---

# Committee Assignment Workflow

```text id="prgwf06"
Select Program

↓

Assign Committee

↓

Validation

↓

Save

↓

Audit Log
```

---

# Attendance Workflow

```text id="prgwf07"
Program On Going

↓

Participant Check In

↓

Attendance Validation

↓

Save Attendance

↓

Attendance Recorded
```

Absensi hanya dapat dilakukan selama Program berlangsung.

---

# Documentation Workflow

```text id="prgwf08"
Program Completed

↓

Upload Documentation

↓

Media Validation

↓

Save Media

↓

Documentation Available
```

Dokumentasi disimpan melalui Domain Media.

---

# Complete Program Workflow

```text id="prgwf09"
Program Finished

↓

Complete Program

↓

Generate Final Report

↓

Enable Certificate

↓

Audit Log
```

---

# Certificate Workflow

```text id="prgwf10"
Completed Program

↓

Verify Eligible Participants

↓

Generate Certificate

↓

Certificate Published
```

Domain Program hanya mengirim data ke Domain Certificate.

---

# Cancel Program Workflow

```text id="prgwf11"
Program Active

↓

Cancel Request

↓

Permission Check

↓

Cancelled

↓

Notification

↓

Audit Log
```

---

# Delete Workflow

```text id="prgwf12"
Delete Request

↓

Dependency Check

↓

Soft Delete

↓

Audit Log
```

Program yang telah memiliki peserta atau sertifikat tidak dapat dihapus.

---

# Search Workflow

```text id="prgwf13"
Search

↓

Filter

↓

Sort

↓

Pagination

↓

Result
```

---

# Permission Workflow

```text id="prgwf14"
Authentication

↓

Authorization

↓

Permission Check

↓

Execute Action
```

---

# Error Workflow

```text id="prgwf15"
Validation Failed

↓

Display Error

↓

Correct Data

↓

Retry
```

---

# Workflow Rules

- Program selalu dimulai dari status **Draft**.
- Pendaftaran hanya tersedia saat **Registration Open**.
- Absensi hanya tersedia saat **On Going**.
- Sertifikat hanya dapat diterbitkan setelah **Completed**.
- Seluruh perubahan status dicatat pada Audit Log.

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

Workflow Program dianggap selesai apabila:

- Siklus hidup Program berjalan sesuai status.
- Pendaftaran mengikuti jadwal.
- Absensi hanya dilakukan saat Program berlangsung.
- Sertifikat hanya diterbitkan setelah Program selesai.
- Seluruh aktivitas mengikuti Business Rules dan tercatat pada Audit Log.
