# Certificate UI

**Project:** LIM Digital Platform

**Domain:** Certificate

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar antarmuka pengguna (UI) pada Domain Certificate.

UI digunakan untuk mengelola template, penerbitan, penandatanganan, distribusi, verifikasi, dan arsip sertifikat digital.

---

# Navigation

```text id="crtui01"
Certificate
├── Dashboard
├── Certificates
├── Templates
├── Distribution
├── Verification
└── Archive
```

---

# Dashboard

Menampilkan:

- Total Certificate
- Generated
- Published
- Downloaded
- Revoked
- Recent Activity

---

# Certificate List

Kolom:

- Certificate Number
- Participant
- Program
- Issue Date
- Status

Action:

- Detail
- Generate
- Sign
- Publish
- Send
- Revoke
- Archive

Fitur:

- Search
- Filter
- Sorting
- Pagination
- Bulk Generate

---

# Certificate Form

Field:

```text id="crtui02"
Program

Participant

Template

Certificate Title

Issue Date

Signer
```

Action:

- Save Draft
- Generate
- Publish

---

# Template

Kolom:

- Code
- Template Name
- Status

Action:

- Create
- Edit
- Delete

---

# Distribution

Kolom:

- Certificate
- Recipient
- Method
- Sent At
- Status

Action:

- Send
- Resend

---

# Verification

Kolom:

- Certificate Number
- Verification Code
- Verification Status
- Verified At

Action:

- Verify
- Copy Verification Link

---

# Archive

Read Only.

Kolom:

- Certificate Number
- Participant
- Archived At
- Archived By

Action:

- View
- Restore

---

# Components

- Data Table
- Search
- Filter
- Pagination
- Select
- Date Picker
- Badge
- QR Code Preview
- PDF Preview
- Modal
- Dialog
- Toast

---

# States

- Empty State
- Loading State
- Error State

---

# Responsive

- Desktop
- Tablet
- Mobile (View, Download, Verify)

---

# Acceptance Criteria

- UI konsisten.
- Responsive.
- Mengikuti Design System.
- QR Code dapat dipreview.
- Seluruh aksi mengikuti Permission.
