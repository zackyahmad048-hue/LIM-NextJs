# Naming Conventions

**Project:** LIM Digital Platform

**Folder:** `03-development`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar penamaan (Naming Conventions) pada LIM Digital Platform.

Tujuan utamanya adalah menjaga konsistensi, meningkatkan keterbacaan kode, serta mempermudah kolaborasi antar developer.

---

# General Principles

Nama harus:

- Jelas.
- Bermakna.
- Konsisten.
- Tidak ambigu.
- Mudah dicari.

Hindari singkatan yang tidak umum.

---

# Project Naming

Gunakan:

```text id="name01"
kebab-case
```

Contoh:

```text id="name02"
lim-digital-platform

notification-service

knowledge-module
```

---

# Folder Naming

Gunakan:

```text id="name03"
kebab-case
```

Contoh:

```text id="name04"
application

domain

value-objects

event-handlers
```

---

# File Naming

Gunakan:

```text id="name05"
kebab-case
```

Contoh:

```text id="name06"
create-program.command.ts

program.repository.ts

notification.service.ts

knowledge.controller.ts
```

---

# Class Naming

Gunakan:

```text id="name07"
PascalCase
```

Contoh:

```text id="name08"
ProgramService

LetterRepository

NotificationController

CalculatePrayerTimeHandler
```

---

# Interface Naming

Gunakan:

```text id="name09"
PascalCase
```

Tanpa prefix `I`.

Contoh:

```text id="name10"
ProgramRepository

NotificationPort

StorageService
```

---

# Method Naming

Gunakan:

```text id="name11"
camelCase
```

Method menggunakan kata kerja.

Contoh:

```text id="name12"
createProgram()

updateLetter()

deleteCertificate()

publishKnowledge()

calculatePrayerTime()
```

---

# Variable Naming

Gunakan:

```text id="name13"
camelCase
```

Contoh:

```text id="name14"
programId

organizationName

notificationStatus

observerLocation
```

---

# Constant Naming

Gunakan:

```text id="name15"
UPPER_SNAKE_CASE
```

Contoh:

```text id="name16"
MAX_UPLOAD_SIZE

DEFAULT_PAGE_SIZE

JWT_EXPIRATION
```

---

# Enum Naming

Gunakan:

```text id="name17"
PascalCase
```

Contoh:

```text id="name18"
ProgramStatus

NotificationType

LetterCategory
```

Enum Value:

```text id="name19"
UPPER_SNAKE_CASE
```

Contoh:

```text id="name20"
ACTIVE

INACTIVE

PUBLISHED
```

---

# Database Naming

## Table

Gunakan:

```text id="name21"
snake_case
```

Contoh:

```text id="name22"
program

organization

notification_queue

knowledge_category
```

---

## Column

Gunakan:

```text id="name23"
snake_case
```

Contoh:

```text id="name24"
created_at

updated_at

organization_id

certificate_number
```

---

## Primary Key

Selalu:

```text id="name25"
id
```

---

## Foreign Key

Format:

```text id="name26"
entity_id
```

Contoh:

```text id="name27"
program_id

organization_id

user_id
```

---

# API Naming

Endpoint menggunakan:

```text id="name28"
kebab-case
```

Contoh:

```text id="name29"
/api/v1/programs

/api/v1/prayer-times

/api/v1/knowledge-categories
```

---

# Event Naming

Gunakan:

```text id="name30"
Entity + Past Tense
```

Contoh:

```text id="name31"
ProgramCreated

LetterApproved

KnowledgePublished

NotificationQueued
```

---

# Repository Naming

Contoh:

```text id="name32"
ProgramRepository

UserRepository

LetterRepository
```

Implementasi:

```text id="name33"
PostgresProgramRepository

PrismaProgramRepository
```

---

# DTO Naming

Contoh:

```text id="name34"
CreateProgramDto

UpdateLetterDto

NotificationResponseDto
```

---

# Command & Query Naming

Command:

```text id="name35"
CreateProgramCommand

PublishKnowledgeCommand
```

Query:

```text id="name36"
GetProgramQuery

SearchKnowledgeQuery
```

---

# Test Naming

Gunakan pola:

```text id="name37"
should_<expected_result>_when_<condition>
```

Contoh:

```text id="name38"
should_create_program_when_data_is_valid

should_reject_invalid_login
```

---

# Naming Rules

- Hindari singkatan yang tidak umum.
- Gunakan istilah bisnis (Ubiquitous Language).
- Hindari nama generik seperti `Data`, `Info`, `Helper`, `Manager`.
- Nama harus menggambarkan tanggung jawab.

---

# Related Documents

- README.md
- coding-standards.md
- git-workflow.md
- testing-strategy.md
- branching-strategy.md
- commit-convention.md
- code-review.md

---

# Acceptance Criteria

- Penamaan konsisten di seluruh proyek.
- Menggunakan Ubiquitous Language.
- Mudah dipahami oleh seluruh developer.
- Tidak menggunakan nama ambigu.
- Naming Convention menjadi standar resmi proyek.
