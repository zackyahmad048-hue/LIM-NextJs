# LIM-NextJs — Design Guidelines

> **Design authority for the LIM-NextJs user interface and user experience.**

This document defines the visual direction, UX principles, component philosophy, layout rules, and interaction principles for LIM-NextJs.

Detailed implementation specifications belong in:

```text
docs/08-design-system/
```

AI agents must read this document before making significant UI/UX changes.

---

# 1. Design Philosophy

LIM-NextJs should feel:

* modern
* clean
* professional
* calm
* trustworthy
* accessible
* consistent
* responsive
* easy to understand

The interface should communicate the identity of LIM without becoming visually excessive.

## Core principle

> **Simple, clear, consistent, and purposeful.**

Do not add visual complexity merely because a component or animation is technically possible.

---

# 2. Design Priorities

When making a design decision, prioritize:

```text
1. Usability
2. Accessibility
3. Clarity
4. Consistency
5. Performance
6. Visual quality
7. Decoration
```

A visually impressive interface that is difficult to use is considered a design failure.

---

# 3. Design Principles

## 3.1 Simple

Prefer simple interfaces over complicated interfaces.

Avoid:

* excessive decoration
* unnecessary cards
* excessive borders
* excessive gradients
* excessive shadows
* unnecessary animations
* crowded navigation

---

## 3.2 Consistent

The same interaction should look and behave consistently throughout the application.

For example:

* buttons should behave consistently
* cards should follow the same visual language
* forms should follow the same structure
* navigation should follow the same interaction model
* spacing should use the established system

Do not introduce a new visual pattern without a reason.

---

## 3.3 Predictable

Users should be able to understand what an element does before interacting with it.

Prefer familiar:

* buttons
* links
* menus
* dialogs
* forms
* tables
* breadcrumbs
* navigation patterns

Avoid unusual interactions unless there is a strong UX reason.

---

## 3.4 Content First

Design should support the content.

Do not allow:

* decorative elements to overpower content
* animations to delay interaction
* large UI elements to unnecessarily consume space
* visual effects to reduce readability

---

# 4. Visual Identity

The visual identity should remain compatible with LIM's organizational character.

The interface should feel institutional and professional without becoming old-fashioned.

Avoid excessive:

* neon colors
* glassmorphism
* heavy gradients
* decorative 3D elements
* exaggerated shadows
* overly playful illustrations

Visual emphasis should come primarily from:

* typography
* spacing
* hierarchy
* imagery
* layout
* controlled color usage

---

# 5. Color System

Colors must be defined through the project's design tokens rather than scattered throughout components.

Prefer semantic tokens such as:

```text
background
foreground
primary
primary-foreground
secondary
secondary-foreground
muted
muted-foreground
accent
accent-foreground
destructive
border
input
ring
```

Components should consume semantic tokens rather than hardcoded colors.

Avoid:

```tsx
className="bg-[#123456]"
```

when an appropriate design token already exists.

---

# 6. Light and Dark Theme

The design system supports:

* Light
* Dark

Both themes must remain usable and accessible.

Do not design only for Light mode.

When adding a component, verify:

```text
Light
↓
Dark
↓
Hover
↓
Focus
↓
Disabled
↓
Error
```

Do not introduce colors that only work in one theme.

---

# 7. Typography

Typography should establish a clear hierarchy.

Use the project's typography tokens and existing font configuration.

Typical hierarchy:

```text
Display
↓
H1
↓
H2
↓
H3
↓
Body
↓
Small / Caption
```

Avoid using font size alone to create hierarchy.

Also consider:

* weight
* line height
* spacing
* contrast
* content density

Long-form content should prioritize readability.

---

# 8. Spacing

Use the existing spacing scale.

Do not invent arbitrary spacing values for every component.

Prefer consistent relationships between:

```text
Page
↓
Section
↓
Component
↓
Content
↓
Element
```

Spacing should create hierarchy and breathing room.

---

# 9. Layout

The application uses a responsive, mobile-first approach.

Design for:

```text
Mobile
↓
Tablet
↓
Desktop
↓
Large Desktop
```

Do not design desktop first and simply shrink it for mobile.

Important layouts should be tested at multiple viewport sizes.

---

# 10. Responsive Design

Responsive behavior should preserve:

* hierarchy
* readability
* accessibility
* navigation usability
* content priority

When space becomes limited:

1. simplify layout
2. reduce columns
3. stack content
4. collapse navigation
5. preserve essential actions

Do not simply shrink everything.

---

# 11. Public Navigation

The public navigation follows the established information architecture.

Primary navigation:

```text
Beranda

Profil
├── Tentang LIM
├── Visi & Misi
├── Pengurus Pusat
└── Bidang
    ├── Tim Wajib Khidmah
    ├── Safari Ramadan
    ├── Safari Dakwah Rutin
    ├── Penelitian & Pengembangan
    ├── Pesantren Ramadan
    ├── Dakwah Digital
    ├── Pendidikan & Kaderisasi
    └── Pemberdayaan Ekonomi

Artikel

Media

Kontak
```

This information architecture must not be changed casually.

Detailed navigation behavior belongs in:

```text
docs/08-design-system/navigation.md
```

---

# 12. Navigation Principles

Navigation must be:

* simple
* consistent
* predictable
* responsive
* accessible

Desktop:

* sticky header where appropriate
* dropdown/navigation menu for nested items
* clear active state

Mobile:

* Drawer/Sheet
* expandable submenus
* clear hierarchy
* easy closing behavior

Admin:

* Sidebar-based navigation
* clear active state
* responsive behavior

Navigation must support:

* keyboard navigation
* screen readers
* focus states
* ARIA semantics
* accessible contrast

Target accessibility level:

> **WCAG AA**

---

# 13. Header

The header should establish the application's identity without consuming excessive vertical space.

The logo should provide a clear route to:

```text
/
```

The header should contain only the navigation/actions appropriate to the current application context.

Public and admin navigation should not be mixed unnecessarily.

---

# 14. Hero Sections

Hero sections should communicate:

1. what LIM is
2. what the page is about
3. what the user can do next

A hero should not become a decorative billboard.

Prefer:

* clear headline
* supporting description
* meaningful CTA
* relevant visual
* sufficient whitespace

Avoid excessive:

* animation
* text
* buttons
* visual effects

---

# 15. Sections

Sections should have clear hierarchy.

A typical section may contain:

```text
Section
├── Heading
├── Supporting description
└── Content
```

Use shared section patterns where possible.

Do not create a completely different section structure for every page.

---

# 16. Cards

Cards should be used when content benefits from grouping.

Good uses:

* programs
* articles
* profiles
* statistics
* features
* related content

Avoid turning every piece of content into a card.

Cards should not become visual containers for content that could simply be presented as normal layout.

---

# 17. Buttons

Buttons should communicate actions clearly.

Use semantic variants:

```text
Primary
Secondary
Outline
Ghost
Destructive
```

Do not create a new button style for individual pages unless required.

Buttons must have:

* clear label
* visible hover state
* visible focus state
* disabled state when necessary
* loading state when necessary

---

# 18. Links

Links represent navigation.

Buttons represent actions.

Do not use buttons where links are semantically appropriate.

Do not make entire UI regions clickable unless the interaction is clear and accessible.

---

# 19. Forms

Forms should prioritize:

* clarity
* accessibility
* predictable interaction
* useful validation

Each field should have:

```text
Label
↓
Input
↓
Supporting text / error
```

Error messages should explain what needs to be corrected.

Avoid vague messages such as:

```text
Invalid input.
```

Prefer actionable messages.

---

# 20. Tables

Tables should be used for structured relational data.

Examples:

* admin records
* users
* reports
* datasets
* Falak calculation data

Tables should remain usable on smaller screens.

When necessary, use:

* horizontal scrolling
* responsive layouts
* prioritized columns
* alternative mobile presentation

Do not force a desktop table into an unreadable mobile layout.

---

# 21. Dashboard

Dashboard UI should prioritize information density without becoming crowded.

A dashboard may contain:

```text
Header
↓
Summary / KPI
↓
Primary information
↓
Recent activity
↓
Secondary information
```

Do not fill the dashboard with cards simply to make it look like a SaaS template.

Every dashboard element should answer a useful question.

---

# 22. Admin UI

Admin interfaces may use higher information density than public pages.

Preferred structure:

```text
Sidebar
+
Top Bar
+
Main Content
```

Admin UI should emphasize:

* efficiency
* clear status
* filtering
* search
* tables
* forms
* predictable actions

Destructive actions should require appropriate confirmation.

---

# 23. Loading States

Loading states should communicate that the system is working.

Prefer:

* skeletons
* inline loading indicators
* button loading states
* appropriate Suspense boundaries

Avoid unnecessary full-page loading states.

Loading UI should preserve layout where possible to reduce layout shift.

---

# 24. Empty States

Empty states should explain:

1. what is empty
2. why it may be empty
3. what the user can do next

Example:

```text
Belum ada artikel.

Artikel yang dibuat akan muncul di sini.
[Tambah Artikel]
```

Avoid empty screens with no explanation.

---

# 25. Error States

Error states should be:

* understandable
* actionable
* visually clear
* non-destructive

Where appropriate, provide:

```text
What happened
↓
What the user can do
↓
Retry / Go back / Contact support
```

Do not expose technical stack traces to normal users.

---

# 26. Motion

Motion is supportive, not decorative.

Use Motion for:

* section entrance
* viewport transitions
* meaningful state changes
* navigation transitions
* subtle interaction feedback

Avoid:

* excessive animation
* animation on every element
* long animations
* animations that delay content
* unnecessary parallax

Prefer animating a meaningful container rather than every child independently.

Respect reduced-motion preferences.

---

# 27. Iconography

Icons should support comprehension.

Use the project's existing icon system.

Do not mix multiple unrelated icon libraries without a reason.

Icons should not replace text when the action would otherwise be ambiguous.

Icon-only buttons must provide accessible labels.

---

# 28. Imagery

Images should support the content.

Prefer:

* authentic imagery
* relevant photography
* consistent aspect ratios
* optimized assets
* appropriate cropping

Avoid decorative images that add no meaningful value.

For organizational imagery, maintain a consistent visual treatment.

---

# 29. Accessibility

Accessibility is a design requirement, not a final checklist.

All UI should consider:

* semantic HTML
* keyboard navigation
* focus visibility
* screen readers
* accessible names
* color contrast
* reduced motion
* form labeling
* error communication

Target:

> **WCAG AA**

Never sacrifice accessibility solely for visual appearance.

---

# 30. Interaction States

Interactive components should define appropriate states.

At minimum, consider:

```text
Default
Hover
Focus
Active
Disabled
Loading
Error
Success
```

Not every component requires every state.

But important interactions must not leave users guessing.

---

# 31. Feedback

The interface should clearly communicate the result of user actions.

Examples:

```text
Save
↓
Saving...
↓
Saved
```

or:

```text
Delete
↓
Confirmation
↓
Deleting...
↓
Deleted / Error
```

Avoid silent operations when the user needs confirmation that something happened.

---

# 32. Performance as Design

Performance is part of UX.

Avoid UI decisions that unnecessarily increase:

* JavaScript
* client-side rendering
* bundle size
* network requests
* image size
* animation cost

Prefer Server Components where possible.

Do not turn static content into client-side code without a reason.

---

# 33. Component Strategy

Use a layered component approach:

```text
Design Tokens
      ↓
UI Primitives
      ↓
Reusable Components
      ↓
Feature Components
      ↓
Page Composition
```

Example:

```text
Button
↓
FormButton
↓
AdminActionButton
↓
Admin User Page
```

Do not skip directly from page-specific UI to duplicated primitives.

---

# 34. shadcn/ui

shadcn/ui may be used as the foundation for reusable UI primitives.

However:

> **shadcn/ui is a foundation, not the application's identity.**

Components may be customized to match LIM's design system.

Do not blindly use default shadcn styling everywhere if it conflicts with the established design.

---

# 35. Design Tokens

Prefer tokens over hardcoded values.

Tokens should cover concepts such as:

```text
Colors
Typography
Spacing
Radius
Shadows
Borders
Motion
Breakpoints
```

When a design value is repeated throughout the application, consider whether it should become a token.

---

# 36. What Not To Do

Do not introduce these patterns without explicit design justification:

* excessive glassmorphism
* excessive gradients
* excessive shadows
* excessive rounded containers
* neon colors
* decorative animations everywhere
* excessive floating elements
* giant typography without purpose
* excessive card nesting
* inconsistent icon styles
* arbitrary spacing
* random component variants
* desktop-only layouts

---

# 37. Design Decision Process

When implementing a new UI:

```text
1. Read design.md
2. Read relevant docs/08-design-system/*
3. Inspect existing components
4. Identify reusable patterns
5. Determine responsive behavior
6. Determine accessibility requirements
7. Implement
8. Test visual states
9. Check Light/Dark
10. Check mobile/desktop
```

---

# 38. Design Documentation Structure

Detailed design specifications should live under:

```text
docs/08-design-system/
```

Recommended structure:

```text
docs/08-design-system/
├── README.md
├── colors.md
├── typography.md
├── components.md
├── forms.md
├── navigation.md
├── theme.md
└── accessibility.md
```

These documents provide implementation-level details.

`design.md` provides the higher-level design direction.

---

# 39. Relationship With AGENTS.md

`AGENTS.md` defines **how the AI agent executes work**.

This file defines **what the UI/UX should be like**.

Therefore:

```text
AGENTS.md
    ↓
Read design rules for UI work
    ↓
design.md
    ↓
Read detailed specification
    ↓
docs/08-design-system/*
    ↓
Inspect implementation
    ↓
Code
```

---

# 40. Relationship With prompt.md

`prompt.md` defines the broader engineering context of LIM-NextJs.

`design.md` specializes that context for UI/UX.

Therefore:

```text
prompt.md
    ├── Architecture
    ├── Engineering principles
    ├── Database
    ├── Authentication
    ├── Falak
    └── General development philosophy

design.md
    ├── Visual identity
    ├── UX principles
    ├── Layout
    ├── Components
    ├── Navigation
    ├── Motion
    └── Accessibility
```

Do not duplicate large sections between the two.

---

# 41. Design Golden Rule

> **The interface should feel intentional, not generated.**

Every visual decision should have a reason.

Every component should have a purpose.

Every interaction should be predictable.

Every page should belong to the same design system.

The user should feel that LIM-NextJs is one coherent product—not a collection of independently generated screens.
