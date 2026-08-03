# ADR-005: Event Driven Architecture

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Accepted

**Date:** 2026-07-14

---

# Context

LIM Digital Platform memiliki banyak domain yang saling berinteraksi, seperti:

- Program
- Letter
- Certificate
- Notification
- Dashboard
- Knowledge
- Falak

Apabila seluruh domain saling memanggil secara langsung (synchronous), maka akan terjadi:

- Tight Coupling.
- Sulit melakukan scaling.
- Sulit menambahkan fitur baru.
- Risiko kegagalan berantai (Cascade Failure).

Diperlukan mekanisme komunikasi asynchronous untuk proses yang tidak membutuhkan respons langsung.

---

# Decision

LIM Digital Platform menggunakan **Event Driven Architecture (EDA)** secara **selektif**.

EDA digunakan hanya pada proses asynchronous.

Komunikasi synchronous tetap menggunakan:

- Application Service
- REST API

Komunikasi asynchronous menggunakan:

- Domain Event
- Event Bus
- Event Handler

---

# Rationale

EDA dipilih karena:

- Mengurangi coupling antar domain.
- Mendukung skalabilitas.
- Mempermudah penambahan fitur baru.
- Mendukung proses asynchronous.
- Selaras dengan CQRS dan Clean Architecture.

---

# Alternatives Considered

## Direct Service Call

```text id="adr00501"
Domain A

↓

Domain B
```

Kelebihan:

- Mudah diimplementasikan.
- Respons langsung.

Kekurangan:

- Tight Coupling.
- Sulit berkembang.
- Sulit melakukan retry.

---

## Message Queue untuk Semua Komunikasi

Kelebihan:

- Sangat scalable.

Kekurangan:

- Kompleks.
- Menambah latency.
- Tidak diperlukan untuk seluruh proses.

---

## Event Driven Selective (Chosen)

Kelebihan:

- Fleksibel.
- Sederhana.
- Efisien.

Kekurangan:

- Memerlukan pengelolaan Event yang baik.

---

# Consequences

Keuntungan:

- Loose Coupling.
- Mudah menambah Subscriber baru.
- Mendukung Background Processing.
- Mempermudah migrasi ke Microservices.

Konsekuensi:

- Debugging lebih kompleks.
- Membutuhkan Idempotent Handler.
- Monitoring Event menjadi penting.

---

# Implementation Rules

Event hanya menggambarkan sesuatu yang telah terjadi.

Format:

```text id="adr00502"
Entity + Past Tense
```

Contoh:

```text id="adr00503"
ProgramCreated

LetterApproved

CertificateIssued

KnowledgePublished

NotificationSent

ObservationConfirmed
```

Event harus:

- Immutable.
- Memiliki Timestamp.
- Memiliki Aggregate ID.
- Memiliki Payload.

---

# Event Bus Strategy

Versi awal menggunakan:

```text id="adr00504"
In Memory Event Bus
```

Roadmap selanjutnya:

```text id="adr00505"
RabbitMQ

Kafka

AWS SNS/SQS

Azure Service Bus
```

Pemilihan bergantung pada kebutuhan skala sistem.

---

# Event Usage

EDA diterapkan pada:

- Notification
- Dashboard Update
- Search Index
- Audit Log
- Media Processing
- Analytics
- Background Job

Tidak digunakan untuk transaksi yang memerlukan respons sinkron secara langsung.

---

# Failure Handling

Apabila Event gagal diproses:

```text id="adr00506"
Retry

↓

Dead Letter Queue (Future)

↓

Manual Investigation
```

Event Handler wajib bersifat **Idempotent**.

---

# Related Decisions

- ADR-001 Domain Driven Design
- ADR-002 Clean Architecture
- ADR-003 Repository Pattern
- ADR-010 Audit Log

---

# References

- Enterprise Integration Patterns
- Designing Event-Driven Systems (Ben Stopford)
- Architecture Documentation (`02-architecture/event-driven.md`)

---

# Status

**Accepted**

---

# Acceptance Criteria

- Domain Event digunakan untuk proses asynchronous.
- Publisher tidak bergantung pada Subscriber.
- Event bersifat immutable.
- Handler bersifat idempotent.
- Event Driven Architecture menjadi standar komunikasi asynchronous pada LIM Digital Platform.
