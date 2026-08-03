# Dashboard Workflow

**Project:** LIM Digital Platform

**Domain:** Dashboard

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan alur proses (workflow) pada Domain Dashboard.

Workflow ini menjadi acuan implementasi Dashboard di Website, Admin Portal, dan Mobile Application apabila diperlukan.

---

# Overview

Dashboard merupakan halaman pertama yang ditampilkan setelah pengguna berhasil melakukan autentikasi.

Dashboard bertugas mengumpulkan informasi dari berbagai domain, kemudian menyajikannya dalam bentuk ringkasan yang sesuai dengan Role dan Permission pengguna.

Dashboard tidak melakukan perubahan data.

---

# Main Workflow

```text id="dwf01"
User

↓

Login

↓

Authentication

↓

Authorization

↓

Load Dashboard

↓

Load Widgets

↓

Display Dashboard
```

---

# Dashboard Loading Workflow

```text id="dwf02"
Request Dashboard

↓

Validate Session

↓

Load User Profile

↓

Load User Roles

↓

Load User Permissions

↓

Load Dashboard Configuration

↓

Load Statistics

↓

Load Recent Activities

↓

Load Announcements

↓

Render Dashboard
```

---

# Statistics Workflow

```text id="dwf03"
Load Statistics

↓

Request Data

↓

Aggregate Data

↓

Filter Soft Deleted Data

↓

Return Statistics

↓

Display Statistics Card
```

---

# Recent Activities Workflow

```text id="dwf04"
Request Activities

↓

Check Permission

↓

Load Activity Log

↓

Sort by Latest

↓

Limit Result

↓

Display Activities
```

---

# Announcement Workflow

```text id="dwf05"
Request Announcement

↓

Load Published Announcement

↓

Filter Active Period

↓

Sort Latest

↓

Display Announcement
```

---

# Quick Access Workflow

```text id="dwf06"
Load User Permission

↓

Load Available Modules

↓

Filter Accessible Modules

↓

Sort by Priority

↓

Display Quick Access
```

---

# System Information Workflow

```text id="dwf07"
Check Permission

↓

Load System Information

↓

Filter Sensitive Data

↓

Display Information
```

---

# Error Workflow

```text id="dwf08"
Widget Error

↓

Write Log

↓

Skip Widget

↓

Continue Loading

↓

Render Remaining Widgets
```

Dashboard tetap dapat digunakan meskipun salah satu widget gagal dimuat.

---

# Refresh Workflow

```text id="dwf09"
User Refresh

↓

Reload Dashboard

↓

Reload Statistics

↓

Reload Activities

↓

Reload Announcement

↓

Update Display
```

---

# Permission Workflow

```text id="dwf10"
User Request

↓

Authentication

↓

Authorization

↓

Permission Check

↓

Load Allowed Widgets

↓

Display Dashboard
```

---

# Exit Workflow

```text id="dwf11"
User Logout

↓

Destroy Session

↓

Redirect Login Page
```

---

# Workflow Rules

- Dashboard hanya dapat diakses oleh pengguna yang telah login.
- Dashboard hanya menampilkan informasi sesuai Role dan Permission.
- Dashboard tidak mengubah data bisnis.
- Widget dimuat secara independen.
- Kegagalan satu widget tidak boleh menyebabkan Dashboard gagal dimuat.
- Seluruh data berasal dari domain resmi melalui Service Layer.

---

# Exception Handling

Apabila terjadi kondisi berikut:

## Session Expired

Alur:

```text id="dwf12"
Session Invalid

↓

Redirect Login
```

---

## Permission Denied

Alur:

```text id="dwf13"
Permission Check

↓

Access Denied

↓

Display Error Message
```

---

## Data Not Available

Alur:

```text id="dwf14"
No Data

↓

Display Empty State
```

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

Workflow Dashboard dianggap benar apabila:

- Pengguna yang telah login dapat membuka Dashboard.
- Informasi yang ditampilkan sesuai Permission.
- Widget dimuat secara independen.
- Dashboard tetap berjalan ketika salah satu widget gagal.
- Seluruh alur mengikuti Architecture dan Business Rules proyek.
