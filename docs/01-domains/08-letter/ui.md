# Letter UI

**Project:** LIM Digital Platform

**Domain:** Letter

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar antarmuka pengguna (UI) pada Domain Letter.

UI digunakan untuk mengelola seluruh siklus surat mulai dari draft, persetujuan, penandatanganan, distribusi, hingga arsip.

---

# Navigation

```text id="ltrui01"
Letter
├── Dashboard
├── Letters
├── Templates
├── Approval
├── Distribution
└── Archive
```

---

# Dashboard

Menampilkan:

- Total Letter
- Draft
- Waiting Approval
- Signed
- Sent
- Archived
- Recent Activity

---

# Letter List

Kolom:

- Letter Number
- Subject
- Recipient
- Signer
- Status
- Issued Date

Action:

- Detail
- Edit
- Submit
- Approve
- Sign
- Send
- Archive

Fitur:

- Search
- Filter
- Sorting
- Pagination

---

# Letter Form

Field:

```text id="ltrui02"
Template

Letter Type

Subject

Recipient

Content

Attachment

Signer
```

Action:

- Save Draft
- Submit

---

# Template

Kolom:

- Code
- Name
- Status

Action:

- Create
- Edit
- Delete

---

# Approval

Kolom:

- Letter
- Reviewer
- Status
- Reviewed At

Action:

- Approve
- Reject

---

# Distribution

Kolom:

- Letter
- Method
- Recipient
- Sent At
- Status

Action:

- Send
- Resend

---

# Archive

Read Only.

Kolom:

- Letter Number
- Subject
- Archived At
- Archived By

Action:

- View
- Restore

---

# Components

- Data Table
- Rich Text Editor
- Search
- Filter
- Pagination
- Select
- File Upload
- Badge
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
- Mobile (View Only)

---

# Acceptance Criteria

- UI konsisten.
- Responsive.
- Mengikuti Design System.
- Seluruh aksi mengikuti Permission.
