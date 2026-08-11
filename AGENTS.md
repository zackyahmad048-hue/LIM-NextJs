# AGENTS.md

# LIM-NextJs — OpenCode Agent Rules

This file defines the execution rules for AI coding agents working on the LIM-NextJs repository.

These rules are mandatory unless the user explicitly overrides them.

---

## 1. Core Rule

> **Understand first. Inspect second. Plan third. Code fourth. Validate last.**

Never start implementing a non-trivial request immediately.

Before changing code, understand:

* what the user wants
* which feature is affected
* the existing implementation
* the relevant documentation
* the existing architecture
* whether an existing component, utility, service, or pattern can be reused

---

# 2. Source of Truth Hierarchy

When information conflicts, use this priority:

```text
1. Explicit user instruction
2. Existing project behavior
3. Relevant project documentation
4. Existing architectural conventions
5. General framework conventions
6. AI assumptions
```

Never override an explicit user instruction with your own preference.

Never assume that a general Next.js convention is automatically correct for this project.

---

# 3. Documentation Must Be Read First

Before implementing a feature, search `docs/` for relevant documentation.

Use documentation to understand:

* requirements
* navigation
* architecture
* design system
* database
* domain rules
* Falak calculations
* feature specifications

If relevant documentation exists, read it before coding.

### Do not do this

```text
User: "Add a Falak calculation page."

Agent:
→ immediately creates page.tsx
→ invents calculation logic
→ invents database structure
```

### Do this

```text
User request
↓
Find relevant docs
↓
Inspect existing Falak implementation
↓
Inspect related types/data
↓
Determine missing pieces
↓
Plan
↓
Implement
```

---

# 4. Research Is Not Implementation

If the user asks to:

* inspect documentation
* research
* investigate
* analyze
* compare
* explain
* diagnose

do NOT modify project files unless implementation was explicitly requested.

For research tasks:

```text
Research
→ Inspect
→ Analyze
→ Explain
```

For implementation tasks:

```text
Research
→ Inspect
→ Plan
→ Implement
→ Validate
```

Do not turn a documentation/research request into a coding task.

---

# 5. Repository Inspection

Before modifying code, inspect the relevant files.

Prefer targeted inspection.

Do not read the entire repository unnecessarily.

For a feature, inspect at minimum:

```text
Relevant docs
↓
Route/page
↓
Feature components
↓
Related services/actions
↓
Types/schemas
↓
Database/auth if applicable
```

Search the repository before creating:

* components
* utilities
* hooks
* services
* types
* schemas
* constants

An existing implementation may already exist.

---

# 6. Do Not Guess File Structure

Never invent a file path when the repository can be inspected.

Bad:

```text
Create:
src/services/falak.ts
```

without checking the existing structure.

Good:

```text
Inspect:
src/features/falak/
src/lib/
src/services/
```

Then follow the established project pattern.

---

# 7. Planning Rule

For small changes, a plan may be internal and concise.

For medium or large changes, state a short plan before implementation.

Example:

```text
Plan:
1. Inspect current navigation.
2. Add the new route.
3. Reuse existing navigation components.
4. Add the required feature component.
5. Update documentation.
6. Run validation.
```

Do not create elaborate plans for trivial changes.

---

# 8. Minimal Change Principle

Implement the smallest correct change.

Avoid:

* unnecessary refactoring
* unrelated cleanup
* renaming unrelated files
* rewriting working components
* changing architecture without reason
* dependency changes unrelated to the task

If a task can be completed by changing 2 files, do not modify 15 files.

---

# 9. Preserve Existing Architecture

Do not replace the project's architecture with your preferred architecture.

Before introducing a new pattern:

1. Search for an existing pattern.
2. Understand why it exists.
3. Reuse it if appropriate.
4. Only introduce a new pattern when necessary.

Consistency is more important than personal preference.

---

# 10. Next.js Rules

Use Server Components by default.

Only add:

```tsx
"use client"
```

when client-side behavior is actually required.

Client Components are appropriate for things such as:

* interactive state
* browser APIs
* event handlers
* client-side effects
* client-side hooks

Do not make an entire page a Client Component just because one child requires interactivity.

Prefer keeping the interactive boundary as small as possible.

---

# 11. Server / Client Boundary

Never move server-only logic into Client Components.

Be careful with:

* Prisma
* database queries
* secrets
* authentication internals
* server-only environment variables
* filesystem access
* server utilities

If a component needs server data, prefer:

```text
Server Component
    ↓
fetch/query
    ↓
Client Component
    ↓
interactive UI
```

when appropriate.

---

# 12. TypeScript

Use strict TypeScript.

Do not use:

```ts
any
```

unless there is a documented reason.

Do not silence errors with:

```ts
// @ts-ignore
```

or:

```ts
// @ts-nocheck
```

unless explicitly justified.

Fix the actual type problem whenever possible.

Prefer precise types.

---

# 13. React Rules

Follow React best practices.

Avoid:

* unnecessary state
* unnecessary effects
* duplicated state
* derived state stored unnecessarily
* unstable keys
* large monolithic components

Do not use `useEffect` simply because data needs to be calculated.

First determine whether the calculation can happen:

* during render
* on the server
* in a server action
* in a utility function
* through existing data-fetching patterns

---

# 14. Component Rules

Before creating a component:

```text
Search existing components
↓
Determine whether one can be reused
↓
Extend existing component if appropriate
↓
Create a new component only if necessary
```

Keep components focused.

Avoid components containing:

* database logic
* authentication logic
* large business calculations
* unrelated UI sections
* excessive state

Move domain logic into the appropriate feature/service layer.

---

# 15. Feature Organization

Feature-specific logic should remain close to the feature.

Prefer:

```text
src/features/<feature>/
```

for feature-specific:

* components
* actions
* services
* queries
* schemas
* calculations
* types
* utilities

Shared infrastructure belongs elsewhere.

Do not put feature-specific code into global folders merely for convenience.

---

# 16. Database / Prisma

The project uses Prisma 7.

Before changing the database:

1. Read the existing schema.
2. Inspect existing models.
3. Inspect relations.
4. Check whether the required data already exists.
5. Determine migration impact.
6. Modify the schema only when necessary.

Never manually modify generated Prisma Client files.

After schema changes, run the appropriate Prisma validation/generation/migration workflow.

Do not blindly use Prisma commands from older Prisma versions.

---

# 17. Authentication

Authentication uses Better Auth.

Before changing authentication:

```text
Inspect:
auth.ts
middleware.ts
proxy.ts
Prisma auth models
existing auth utilities
```

Do not create a second authentication mechanism.

Do not duplicate Better Auth functionality.

---

# 18. Authorization

Never rely on the UI for authorization.

This is insufficient:

```tsx
{user.role === "ADMIN" && <AdminButton />}
```

The server must also enforce authorization.

For protected operations:

```text
Authenticate
↓
Authorize
↓
Validate input
↓
Perform operation
```

---

# 19. Forms

Forms must have:

* proper labels
* validation
* useful error messages
* loading/pending states
* accessible controls

Validate sensitive or important input on the server.

Never trust client-side validation alone.

---

# 20. Falak Rules

Falak calculations are domain logic.

Never implement complex Falak calculations directly inside UI components.

Prefer:

```text
features/falak/
├── calculations/
├── services/
├── schemas/
├── types/
└── components/
```

when consistent with the existing architecture.

Calculation code must be:

* deterministic
* testable
* explicit about units
* explicit about assumptions
* separated from presentation

Never silently change an astronomical formula or calculation method.

If a calculation method is unclear, inspect the documentation or ask the user.

---

# 21. UI Rules

Use the existing design system.

Before creating a new:

* Button
* Card
* Dialog
* Input
* Form
* Table
* Navigation
* Section heading

search for an existing implementation.

Do not create duplicate UI primitives.

Follow existing:

* spacing
* typography
* radius
* layout
* responsive behavior
* interaction patterns

---

# 22. Animation Rules

Motion should be purposeful.

Prefer:

* subtle entrance animation
* viewport animation
* section-level animation
* reusable motion utilities

Avoid:

* excessive animation
* animation on every DOM node
* animation that harms accessibility
* animation that hurts performance

Respect reduced-motion preferences when applicable.

---

# 23. Images

Use `next/image` when appropriate.

For important images:

* provide appropriate dimensions
* use meaningful alt text
* avoid unnecessarily large assets
* handle LCP correctly
* preserve responsive behavior

Do not disable image optimization globally to solve a local problem.

---

# 24. Accessibility

All UI work should consider accessibility.

Pay attention to:

* semantic HTML
* labels
* keyboard navigation
* focus states
* button semantics
* link semantics
* alt text
* color contrast
* screen-reader context

Do not use a `<div>` as a button when a `<button>` is appropriate.

---

# 25. Security

Never expose:

* secrets
* passwords
* tokens
* private environment variables
* database credentials
* server-only information

Never commit secrets.

Never trust user input.

Validate server-side boundaries.

Do not expose privileged database operations to the client.

---

# 26. Environment Variables

When adding a new environment variable:

1. Add it to `.env.example`.
2. Document its purpose if necessary.
3. Never commit the real secret.
4. Never hardcode credentials.

Use server-only variables correctly.

---

# 27. Dependencies

Before installing a package:

```text
Check existing dependencies
↓
Check whether the functionality already exists
↓
Check whether native functionality is sufficient
↓
Install only if justified
```

Do not install packages for trivial utilities.

Consider:

* bundle size
* maintenance
* compatibility
* security
* project complexity

---

# 28. Error Handling

Do not silently swallow errors.

Bad:

```ts
try {
  await operation()
} catch {
}
```

Handle errors intentionally.

Use appropriate:

* error boundaries
* user-facing messages
* server errors
* logging
* fallback UI

Preserve useful debugging information.

---

# 29. Tests

Use Vitest where applicable.

Tests are especially important for:

* calculations
* business rules
* validation
* transformations
* authorization logic
* utilities
* Falak domain logic

Do not write tests merely to increase test count.

Test behavior.

---

# 30. Validation

After implementation, run the relevant checks.

Depending on the task:

```text
TypeScript
ESLint
Vitest
Prisma validation
Prisma generation
Next.js build
```

Do not run every possible command for a trivial change if it is unnecessary.

But for significant changes, perform broader validation.

---

# 31. Fix Errors at the Root

When encountering an error:

Do not immediately patch the symptom.

Instead:

```text
Read error
↓
Locate source
↓
Understand root cause
↓
Fix root cause
↓
Validate
```

Avoid hacks such as:

```ts
as any
```

unless genuinely justified.

---

# 32. Existing Errors

If unrelated errors already exist:

1. Do not claim they were caused by your change.
2. Record them.
3. Avoid modifying unrelated code unless necessary.
4. Clearly distinguish:

   * pre-existing errors
   * errors introduced by the current change

---

# 33. Do Not Overwrite User Work

Never overwrite existing work blindly.

Before replacing a file or large section:

* inspect the current contents
* preserve unrelated changes
* make targeted edits

Do not regenerate entire files when a small edit is sufficient.

---

# 34. Git Safety

Do not perform destructive Git operations unless explicitly requested.

Never casually run:

```text
git reset --hard
git clean -fd
git checkout .
```

Do not discard user changes.

Do not rewrite history unless explicitly requested.

---

# 35. File Modification Rules

Prefer targeted modifications.

Before editing:

```text
Read file
↓
Understand context
↓
Edit smallest necessary section
↓
Inspect diff
```

After editing:

```text
Review changed files
↓
Check for accidental changes
```

---

# 36. Documentation Updates

If implementation changes an established architecture, feature specification, database structure, navigation, or domain behavior, determine whether documentation must also be updated.

Do not allow documentation to become misleading.

However, do not update unrelated documentation merely because you touched the project.

---

# 37. User Intent

The user's request determines the scope.

If the user asks:

> "Check this documentation."

Do not implement.

If the user asks:

> "Research how this should work."

Research first.

If the user asks:

> "Implement this."

Implement after inspection.

If the user asks:

> "Fix this error."

Inspect the error and surrounding implementation before changing code.

---

# 38. When to Ask the User

Ask for clarification only when the missing information materially affects:

* architecture
* data model
* security
* business rules
* calculation method
* destructive behavior
* user-visible behavior

Do not ask questions whose answers can be obtained by inspecting the repository.

---

# 39. OpenCode Workflow

For every meaningful coding task, follow:

```text
1. UNDERSTAND
   ↓
2. SEARCH DOCS
   ↓
3. INSPECT CODE
   ↓
4. IDENTIFY EXISTING PATTERNS
   ↓
5. PLAN
   ↓
6. IMPLEMENT
   ↓
7. INSPECT DIFF
   ↓
8. VALIDATE
   ↓
9. REPORT
```

Never skip directly from:

```text
USER REQUEST
↓
CODE
```

---

# 40. Tool Usage

Use repository tools intelligently.

Prefer targeted searches before opening many files.

Examples:

```text
Search for:
- component names
- route names
- database model names
- function names
- existing implementations
- relevant documentation
```

Do not repeatedly inspect the same files without reason.

---

# 41. Response After Implementation

After completing a task, report:

```text
### Changed
- file/path
- file/path

### What changed
- concise explanation

### Validation
- TypeScript: ...
- ESLint: ...
- Tests: ...
- Build: ...

### Notes
- remaining issue, if any
```

Do not claim a check passed unless it was actually run.

---

# 42. No Fake Completion

Never say:

```text
Done.
```

if the implementation has not actually been validated when validation is possible.

Never claim:

```text
Tests passed.
```

without running them.

Never claim:

```text
Build successful.
```

without running the build.

Be explicit about what was and was not verified.

---

# 43. No Unnecessary Code Dump

When explaining implementation:

Do not dump large amounts of code unless the user needs the code.

Prefer explaining:

```text
what changed
why it changed
where it changed
how it was validated
```

When the user explicitly asks for code, provide the relevant code.

---

# 44. No Hallucinated APIs

Never assume:

* a package has a certain API
* a library supports a feature
* a project file exists
* a database model exists
* an endpoint exists

Verify through:

* repository inspection
* installed package metadata
* official documentation
* source code

If uncertain, say so.

---

# 45. No Premature Refactoring

Do not refactor unrelated code during feature implementation.

For example:

```text
User:
"Add admin user deletion."

Do NOT:
- rewrite authentication
- reorganize all components
- replace the UI library
- rename unrelated files
- upgrade Next.js
```

unless those changes are required.

---

# 46. Performance

Consider performance when implementing features.

Avoid:

* unnecessary client components
* unnecessary network requests
* unnecessary database queries
* excessive dependencies
* huge client bundles
* unnecessary re-renders

Prefer server-side work when appropriate.

---

# 47. Maintainability

Code should be understandable to another developer.

Prefer explicit code over clever abstractions.

Do not create abstractions merely because two pieces of code look similar once.

Abstract repeated behavior when repetition is meaningful.

---

# 48. Priority of Correctness

When choosing between:

```text
fast implementation
```

and:

```text
correct maintainable implementation
```

choose the latter.

When choosing between:

```text
clever solution
```

and:

```text
simple solution
```

prefer the simple solution unless the clever solution provides a meaningful benefit.

---

# 49. Final Rule

The agent must continuously ask:

> "Am I implementing what the project actually needs, or am I inventing what I think it needs?"

If the answer is uncertain:

```text
Stop.
Inspect.
Search documentation.
Then continue.
```

The purpose of OpenCode is to extend LIM-NextJs consistently, not to redesign the project during every task.

---

# 50. Execution Summary

```text
┌─────────────────────────────┐
│       USER REQUEST           │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│      UNDERSTAND REQUEST     │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│       SEARCH DOCS            │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│       INSPECT CODE           │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│   FIND EXISTING PATTERNS     │
└──────────────┬──────────────┘
               ↓
        ┌──────┴──────┐
        │             │
     Ambiguous      Clear
        │             │
        ↓             ↓
      ASK           PLAN
                      ↓
                 IMPLEMENT
                      ↓
                 REVIEW DIFF
                      ↓
                  VALIDATE
                      ↓
                   REPORT
```

**Never skip the inspection phase for non-trivial work.**
