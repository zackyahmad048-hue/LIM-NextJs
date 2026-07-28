# Testing Strategy

**Project:** LIM Digital Platform

**Folder:** `03-development`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan strategi pengujian (Testing Strategy) pada LIM Digital Platform.

Strategi ini bertujuan memastikan setiap fitur memenuhi kebutuhan bisnis, bebas dari regresi, serta memiliki kualitas yang tinggi sebelum dirilis ke Production.

---

# Testing Pyramid

```text id="test01"
          E2E Test
              ▲
     Integration Test
              ▲
        Unit Test
```

Prioritas pengujian:

* Banyak Unit Test.
* Integration Test secukupnya.
* End-to-End Test untuk alur bisnis utama.

---

# Test Levels

## Unit Test

Menguji:

* Entity
* Value Object
* Domain Service
* Use Case
* Business Rules

Tidak bergantung pada:

* Database
* HTTP
* Framework
* External API

---

## Integration Test

Menguji integrasi antara:

* Repository
* Database
* Queue
* Storage
* Notification
* External Service

---

## End-to-End Test

Menguji alur bisnis secara penuh.

Contoh:

* Login
* Create Program
* Create Letter
* Publish Knowledge
* Generate Certificate
* Calculate Prayer Time

---

# Test Coverage

Target minimum:

| Test              | Coverage |
| ----------------- | -------: |
| Domain Layer      |    ≥ 90% |
| Application Layer |    ≥ 80% |
| Infrastructure    |    ≥ 60% |
| Presentation      |    ≥ 60% |

Target keseluruhan proyek:

```text id="test02"
Minimum Coverage = 80%
```

---

# Test Structure

```text id="test03"
tests/

unit/

integration/

e2e/

fixtures/

helpers/

mocks/
```

---

# Naming Convention

Gunakan pola:

```text id="test04"
should_<expected_result>_when_<condition>
```

Contoh:

```text id="test05"
should_create_program_when_data_is_valid

should_return_validation_error_when_title_is_empty

should_publish_article_after_review
```

---

# Mocking Rules

Gunakan Mock untuk:

* Repository
* Notification
* Email
* Storage
* External API
* Queue

Jangan melakukan Mock terhadap Business Rules.

---

# Test Data

Gunakan:

* Fixture
* Factory
* Builder Pattern

Hindari penggunaan data Production.

---

# Regression Testing

Regression Test wajib dijalankan apabila:

* Merge ke `develop`
* Release
* Hotfix
* Refactoring besar

---

# CI Testing

CI Pipeline wajib menjalankan:

```text id="test06"
Lint

↓

Static Analysis

↓

Unit Test

↓

Integration Test

↓

Coverage

↓

Build
```

Pull Request tidak boleh di-merge apabila salah satu proses gagal.

---

# Manual Testing

Dilakukan untuk:

* UI/UX
* Cross Browser
* Mobile Responsiveness
* Accessibility
* Exploratory Testing

---

# Performance Testing

Dilakukan pada:

* REST API
* Database Query
* Search
* Dashboard
* File Upload

Metrik utama:

* Response Time
* Throughput
* Memory Usage
* CPU Usage

---

# Security Testing

Meliputi:

* Authentication
* Authorization
* SQL Injection
* XSS
* CSRF
* File Upload Validation
* Rate Limiting

---

# Acceptance Testing

Dilakukan berdasarkan:

* Business Rules
* User Story
* Acceptance Criteria

Fitur dianggap selesai apabila seluruh Acceptance Test lulus.

---

# Testing Principles

* Test Business Rules terlebih dahulu.
* Test harus deterministik.
* Test tidak saling bergantung.
* Test harus cepat dijalankan.
* Test harus mudah dipelihara.

---

# Related Documents

* README.md
* coding-standards.md
* naming-conventions.md
* git-workflow.md
* branching-strategy.md
* commit-convention.md
* code-review.md

---

# Acceptance Criteria

* Seluruh Business Rules memiliki Unit Test.
* Coverage minimum 80%.
* CI menjalankan seluruh pengujian otomatis.
* Regression Test dilakukan sebelum Release.
* Testing Strategy menjadi standar resmi proyek.
