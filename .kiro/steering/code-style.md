---
inclusion: always
---

# Code Style Guide

## JavaScript
- Use `const` by default; `let` only when reassignment is needed
- Arrow functions for callbacks, regular `function` declarations for top-level named functions
- Prefer template literals over string concatenation
- Always use `===` / `!==` (never `==`)
- Keep functions small and single-purpose
- Comment non-obvious logic with `// ──` section dividers for readability
- No `var`

## HTML
- Use semantic elements (`<header>`, `<main>`, `<section>`, `<ul>`, `<li>`, `<button>`)
- Every interactive element needs an `aria-label` or visible label
- Decorative elements get `aria-hidden="true"`
- `id` attributes are used for JS hooks; `class` attributes for styling

## CSS
- Mobile-first: base styles for small screens, `@media (min-width: ...)` for larger
- Use CSS custom properties for any repeated value (color, spacing, radius)
- Class naming: BEM-lite (`.block`, `.block-element`, `.block--modifier`)
- No `!important`
- Transitions via the `--transition` variable for consistency

## General
- No console.log left in production code (use `console.warn` for caught errors only)
- Keep the UI accessible: sufficient color contrast, focusable controls, keyboard-navigable
