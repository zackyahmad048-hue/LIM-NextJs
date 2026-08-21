# Authentication - Database

**Project:** LIM Digital Platform

**Domain:** Authentication

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan database schema untuk domain Authentication.

---

# Tables

### user

| Field         | Type      | Constraint       | Keterangan                       |
| ------------- | --------- | ---------------- | -------------------------------- |
| id            | UUID      | PK               | Primary key                      |
| email         | VARCHAR   | UNIQUE, NOT NULL | Email pengguna                   |
| name          | VARCHAR   | NOT NULL         | Nama pengguna                    |
| password      | VARCHAR   | NOT              | Password hash (null untuk OAuth) |
| emailVerified | BOOLEAN   | DEFAULT false    | Status verifikasi email          |
| image         | VARCHAR   | NULL             | Avatar URL                       |
| createdAt     | TIMESTAMP | DEFAULT now()    | Waktu pembuatan                  |
| updatedAt     | TIMESTAMP |                  | Waktu update terakhir            |

### session

| Field     | Type      | Constraint       | Keterangan                 |
| --------- | --------- | ---------------- | -------------------------- |
| id        | UUID      | PK               | Primary key                |
| userId    | UUID      | FK -> user.id    | User yang memiliki session |
| token     | VARCHAR   | UNIQUE, NOT NULL | Session token              |
| ipAddress | VARCHAR   | NULL             | IP address                 |
| userAgent | VARCHAR   | NULL             | Browser/OS info            |
| expiresAt | TIMESTAMP | NOT NULL         | Waktu expired              |
| createdAt | TIMESTAMP | DEFAULT now()    | Waktu pembuatan            |

### account

| Field        | Type    | Constraint    | Keterangan                     |
| ------------ | ------- | ------------- | ------------------------------ |
| id           | UUID    | PK            | Primary key                    |
| userId       | UUID    | FK -> user.id | User yang memiliki account     |
| accountId    | VARCHAR | NOT NULL      | ID dari provider               |
| providerId   | VARCHAR | NOT NULL      | Provider (google, github, dll) |
| accessToken  | VARCHAR | NULL          | Access token                   |
| refreshToken | VARCHAR | NULL          | Refresh token                  |

### verification

| Field      | Type      | Constraint    | Keterangan         |
| ---------- | --------- | ------------- | ------------------ |
| id         | UUID      | PK            | Primary key        |
| identifier | VARCHAR   | NOT NULL      | Email atau user ID |
| value      | VARCHAR   | NOT NULL      | Token verifikasi   |
| expiresAt  | TIMESTAMP | NOT NULL      | Waktu expired      |
| createdAt  | TIMESTAMP | DEFAULT now() | Waktu pembuatan    |

---

# Relations

`user 1--* session
user 1--* account`

---

# Indexes

- `user.email` (UNIQUE)
- `session.token` (UNIQUE)
- `session.userId` (INDEX)
- `session.expiresAt` (INDEX)
- `account.userId` (INDEX)
- `verification.identifier` (INDEX)

---

# Related Documents

- `README.md` - Domain overview.
- `business-rules.md` - Business rules.
- `api.md` - API endpoints.
