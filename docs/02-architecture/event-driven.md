# Event Driven Architecture

**Project:** LIM Digital Platform

**Folder:** `02-architecture`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan implementasi **Event Driven Architecture (EDA)** pada LIM Digital Platform.

EDA digunakan secara **selektif** untuk mengurangi coupling antar domain dan memungkinkan komunikasi asynchronous melalui Domain Event.

---

# Overview

Sebagian besar komunikasi antar domain menggunakan:

- Application Service
- REST API

Sedangkan proses yang bersifat asynchronous menggunakan Domain Event.

Contoh:

- Notification
- Audit Log
- Dashboard Update
- Media Processing

---

# Event Architecture

```text id="eda01"
Command

↓

Domain

↓

Domain Event

↓

Event Bus

↓

Event Handler

↓

Subscriber
```

---

# Event Lifecycle

```text id="eda02"
Business Action

↓

Domain Event

↓

Publish Event

↓

Event Bus

↓

Subscriber

↓

Business Process
```

---

# Domain Event

Domain Event merepresentasikan sesuatu yang telah terjadi pada Domain.

Contoh:

```text id="eda03"
ProgramCreated

LetterApproved

CertificateIssued

KnowledgePublished

NotificationSent

UserLoggedIn
```

---

# Publisher

Publisher hanya bertanggung jawab menerbitkan Event.

Publisher tidak mengetahui siapa Subscriber.

---

# Subscriber

Subscriber bertanggung jawab:

- Mendengarkan Event.
- Menjalankan proses lanjutan.
- Tidak mengubah Business Rules Publisher.

---

# Event Flow

```text id="eda04"
Create Certificate

↓

CertificateIssued Event

↓

Notification Handler

↓

Send Notification
```

---

Contoh lain:

```text id="eda05"
Publish Knowledge

↓

KnowledgePublished

↓

Search Index Handler

↓

Update Search Index
```

---

# Event Bus

Event Bus menjadi media komunikasi antar domain.

Implementasi dapat berupa:

- In Memory Event Bus
- Message Queue
- RabbitMQ
- Kafka
- Azure Service Bus
- AWS SNS/SQS

Versi awal Modular Monolith cukup menggunakan **In Memory Event Bus**.

---

# Event Naming

Format:

```text id="eda06"
Entity + Past Tense
```

Contoh:

```text id="eda07"
ProgramCreated

LetterSigned

CertificateGenerated

NotificationQueued

PrayerTimeGenerated

ObservationConfirmed
```

---

# Event Structure

Minimal memiliki:

```text id="eda08"
EventId

EventName

OccurredAt

AggregateId

Payload
```

---

# Event Consumers

Contoh Subscriber:

| Event                | Consumer     |
| -------------------- | ------------ |
| ProgramCreated       | Dashboard    |
| CertificateIssued    | Notification |
| KnowledgePublished   | Search Index |
| LetterApproved       | Audit Log    |
| ObservationConfirmed | Dashboard    |
| NotificationSent     | Analytics    |

---

# Event Rules

- Event bersifat immutable.
- Event tidak boleh diubah setelah dipublikasikan.
- Event hanya menggambarkan sesuatu yang telah terjadi.
- Event tidak boleh digunakan sebagai Command.

---

# Event Processing

```text id="eda09"
Publish

↓

Queue

↓

Consume

↓

Handle

↓

Complete
```

Apabila gagal:

```text id="eda10"
Handle

↓

Retry

↓

Dead Letter Queue (Future)
```

---

# Event Ordering

Apabila diperlukan:

- FIFO Queue
- Event Version
- Idempotent Handler

Handler harus mampu menangani event yang diterima lebih dari sekali (**Idempotency**).

---

# Benefits

- Loose Coupling.
- Scalability.
- Asynchronous Processing.
- Independent Modules.
- Better Extensibility.

---

# Usage

EDA digunakan pada:

- Notification
- Dashboard
- Audit Log
- Search Index
- Media Processing
- Analytics

Tidak seluruh proses harus menggunakan Event.

---

# Related Documents

- README.md
- architecture-overview.md
- clean-architecture.md
- hexagonal-architecture.md
- cqrs.md
- folder-structure.md
- dependency-rules.md

---

# Acceptance Criteria

- Domain Event terdokumentasi.
- Publisher dan Subscriber terpisah.
- Event bersifat immutable.
- Implementasi mengikuti prinsip Loose Coupling.
- Event Driven Architecture diterapkan hanya pada proses yang sesuai.
