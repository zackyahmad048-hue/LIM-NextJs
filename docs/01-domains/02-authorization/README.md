# AUTHORIZATION

**Project:** LIM Digital Platform

**Domain:** Authorization

**Version:** 1.0

**Status:** Approved

**Document Type:** Domain Specification

---

# Purpose

Domain Authorization bertanggung jawab terhadap pengelolaan hak akses seluruh pengguna pada LIM Digital Platform.

Domain ini menentukan **siapa yang boleh mengakses apa**, **aksi apa yang dapat dilakukan**, dan **batasan akses** berdasarkan Role dan Permission.

Domain ini tidak menangani proses Login maupun Session. Hal tersebut menjadi tanggung jawab Domain Authentication.

---

# Scope

Domain Authorization mencakup:

* Role Management
* Permission Management
* Role Assignment
* Permission Checking
* Access Control
* Menu Authorization

Tidak mencakup:

* Login
* Logout
* Session
* Password
* Email Verification

---

# Objectives

Tujuan domain ini adalah:

* Mengatur hak akses pengguna.
* Mencegah akses yang tidak sah.
* Menyediakan sistem RBAC yang konsisten.
* Mendukung pengembangan modul baru tanpa mengubah mekanisme otorisasi.

---

# Actors

## Super Administrator

Memiliki akses penuh terhadap seluruh sistem.

Hak:

* Mengelola Role.
* Mengelola Permission.
* Menetapkan Role kepada User.
* Mengakses seluruh modul.

---

## Administrator

Mengelola modul sesuai Role yang dimiliki.

Tidak dapat mengubah konfigurasi Super Administrator.

---

## User

Mengakses fitur sesuai Role yang dimiliki.

---

# Core Concepts

Authorization menggunakan tiga komponen utama.

## User

Identitas pengguna.

---

## Role

Sekumpulan Permission.

Contoh:

* Super Admin
* Admin
* Editor
* Operator

---

## Permission

Hak akses terhadap aksi tertentu.

Contoh:

```text id="au01"
user.create

user.update

user.delete

program.view

program.create

certificate.publish
```

---

# RBAC Model

Model yang digunakan:

```text id="au02"
User

↓

Role

↓

Permission

↓

Action
```

Permission tidak diberikan langsung kepada User.

---

# Permission Convention

Format:

```text id="au03"
resource.action
```

Contoh:

```text id="au04"
post.view

post.create

post.update

post.delete

program.publish

certificate.verify
```

---

# Standard Actions

Aksi standar:

```text id="au05"
view

create

update

delete

publish

restore

approve

verify
```

Domain tertentu dapat menambahkan aksi lain bila diperlukan.

---

# Role Management

Role harus:

* Memiliki nama unik.
* Memiliki daftar Permission.
* Dapat dinonaktifkan.
* Tidak boleh dihapus apabila masih digunakan oleh User.

---

# Permission Management

Permission:

* Bersifat unik.
* Dikelompokkan berdasarkan domain.
* Digunakan kembali oleh seluruh aplikasi.

Permission tidak dibuat secara dinamis oleh pengguna.

---

# User Role Assignment

Satu User dapat memiliki satu atau lebih Role sesuai kebutuhan organisasi.

Hak akses pengguna merupakan gabungan dari seluruh Permission pada Role yang dimiliki.

---

# Authorization Flow

```text id="au06"
Request

↓

Authentication

↓

Get User

↓

Load Roles

↓

Load Permissions

↓

Permission Check

↓

Business Rules

↓

Response
```

---

# Menu Authorization

Menu Admin hanya ditampilkan apabila User memiliki Permission yang sesuai.

Menu yang tidak memiliki hak akses tidak ditampilkan.

---

# Business Rules

* User harus login sebelum dilakukan Permission Check.
* Permission diperiksa pada setiap aksi yang memerlukan otorisasi.
* Role tanpa Permission tidak memberikan akses.
* Super Administrator memiliki akses penuh.
* Permission menjadi dasar seluruh kontrol akses.

---

# Dependencies

Domain ini bergantung pada:

* Authentication
* User Repository

---

# Related Domains

Authorization digunakan oleh seluruh domain:

* Dashboard
* CMS
* Organization
* Program
* Secretariat
* Letter
* Certificate
* Knowledge
* Falak
* Media
* Notification
* Settings

---

# Database

Entitas utama:

* Role
* Permission
* UserRole
* RolePermission

Detail dijelaskan pada `database.md`.

---

# API

Endpoint utama:

```text id="au07"
GET    /roles

POST   /roles

PUT    /roles/{id}

DELETE /roles/{id}

GET    /permissions

POST   /roles/{id}/permissions

POST   /users/{id}/roles
```

---

# Security

Authorization wajib:

* Memeriksa Permission sebelum menjalankan Business Rules.
* Menolak akses tanpa Permission yang sesuai.
* Mencatat perubahan Role dan Permission pada Audit Log.

---

# Audit

Aktivitas berikut dicatat:

* Create Role
* Update Role
* Delete Role
* Assign Role
* Remove Role
* Update Permission

---

# Acceptance Criteria

Domain Authorization dianggap selesai apabila:

* Role dapat dikelola.
* Permission dapat dikelola.
* User dapat diberikan Role.
* Permission diperiksa pada setiap aksi.
* Menu mengikuti Permission pengguna.
* Audit Log tercatat.

---

# Future Roadmap

Pengembangan berikutnya dapat mencakup:

* Dynamic Permission Groups
* Temporary Role Assignment
* Organization-based Role
* Permission Cache
* Policy Based Authorization

---

# Governance

Authorization menjadi fondasi pengendalian akses pada LIM Digital Platform.

Seluruh domain wajib menggunakan mekanisme Authorization ini dan tidak diperbolehkan membuat sistem hak akses sendiri.
