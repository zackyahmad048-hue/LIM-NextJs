# External References

**Project:** LIM Digital Platform

**Folder:** `06-references`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendokumentasikan referensi eksternal yang menjadi acuan dalam perancangan, pengembangan, deployment, keamanan, dan operasional LIM Digital Platform.

Referensi ini digunakan sebagai dasar penerapan standar industri dan praktik terbaik (*best practices*).

---

# Architecture References

## Domain Driven Design

Digunakan sebagai dasar pemodelan Domain.

Referensi:

* Eric Evans — *Domain-Driven Design: Tackling Complexity in the Heart of Software*
* Vaughn Vernon — *Implementing Domain-Driven Design*

Digunakan pada:

* Domain Modeling
* Bounded Context
* Aggregate
* Value Object
* Domain Service

---

## Clean Architecture

Referensi:

* Robert C. Martin — *Clean Architecture*

Digunakan untuk:

* Layer Separation
* Dependency Rule
* Use Case Design
* Repository Pattern

---

## Hexagonal Architecture

Referensi:

* Alistair Cockburn — *Ports and Adapters Architecture*

Digunakan untuk:

* Port
* Adapter
* Infrastructure
* External Integration

---

# API References

Referensi:

* REST Architectural Style
* OpenAPI Specification 3.x
* JSON RFC 8259
* HTTP RFC 9110

Digunakan untuk:

* REST API
* Response Format
* HTTP Status Code
* API Documentation

---

# Security References

Referensi:

* OWASP Top 10
* OWASP API Security Top 10
* OWASP Cheat Sheet Series
* NIST Cybersecurity Framework

Digunakan untuk:

* Authentication
* Authorization
* Input Validation
* Logging
* Secure Coding

---

# Database References

Referensi:

* PostgreSQL Documentation
* SQL Standard (ANSI SQL)
* ACID Transaction Principles

Digunakan untuk:

* Database Design
* Transaction
* Index
* Constraint
* Query Optimization

---

# DevOps References

Referensi:

* Docker Documentation
* Docker Compose Documentation
* GitHub Actions Documentation

Digunakan untuk:

* Containerization
* CI/CD
* Deployment
* Automation

---

# Git References

Referensi:

* Git Documentation
* Conventional Commits
* Semantic Versioning

Digunakan untuk:

* Git Workflow
* Branching Strategy
* Commit Convention
* Release Management

---

# Testing References

Referensi:

* Testing Pyramid
* Test Driven Development (TDD)
* Behavior Driven Development (BDD)

Digunakan untuk:

* Unit Test
* Integration Test
* End-to-End Test
* Test Coverage

---

# Monitoring References

Referensi:

* OpenTelemetry
* Prometheus
* Grafana

Digunakan untuk:

* Metrics
* Logs
* Tracing
* Alerting
* Dashboard

---

# Cloud & Infrastructure References

Referensi:

* Twelve-Factor App
* AWS Well-Architected Framework
* CNCF Cloud Native Landscape

Digunakan untuk:

* Configuration
* Scalability
* Reliability
* Observability
* Deployment

---

# Coding References

Referensi:

* SOLID Principles
* Clean Code
* Refactoring
* Design Patterns (GoF)

Digunakan untuk:

* Coding Standards
* Refactoring
* Object-Oriented Design
* Maintainability

---

# Documentation References

Referensi:

* Architecture Decision Records (ADR)
* C4 Model
* Diátaxis Documentation Framework
* Markdown Guide

Digunakan untuk:

* Technical Documentation
* Architecture Documentation
* Decision Records
* Developer Guide

---

# Usage Policy

Seluruh referensi eksternal:

* Harus berasal dari sumber yang terpercaya.
* Digunakan sebagai pedoman, bukan aturan mutlak.
* Dapat diperbarui apabila terdapat standar baru yang lebih relevan.
* Harus disesuaikan dengan kebutuhan bisnis LIM Digital Platform.

---

# Reference Maintenance

Review referensi dilakukan:

* Minimal satu kali setiap tahun.
* Saat terdapat perubahan teknologi utama.
* Saat melakukan upgrade framework.
* Saat melakukan perubahan arsitektur.

---

# Related Documents

* README.md
* glossary.md
* coding-reference.md
* api-reference.md
* database-reference.md

---

# Acceptance Criteria

* Seluruh standar memiliki referensi yang jelas.
* Referensi berasal dari sumber yang kredibel.
* Referensi mendukung implementasi arsitektur, pengembangan, deployment, dan keamanan.
* External References menjadi acuan resmi penggunaan standar eksternal pada LIM Digital Platform.
