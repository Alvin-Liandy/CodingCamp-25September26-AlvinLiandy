---
inclusion: always
---

# Expense & Budget Visualizer — Project Steering

## Project Overview
A mobile-friendly expense tracker web app. Users can add transactions, view a running total balance, see a scrollable transaction history, and visualize spending by category via a pie chart.

## Tech Stack
- **HTML** — structure only, semantic elements
- **CSS** — vanilla, mobile-first, CSS custom properties (no frameworks)
- **JavaScript** — vanilla ES6+, no frameworks (no React, Vue, etc.)
- **Chart.js 4** — loaded via CDN for the pie chart
- **LocalStorage** — all data stored client-side, no backend

## File Structure
```
RevoU-codingcamp/
├── index.html   # App shell, all sections in one page
├── style.css    # All styles, mobile-first
└── app.js       # All logic: state, DOM, validation, chart, storage
```

## Key Conventions

### JavaScript
- State lives in a single `transactions` array (loaded from LocalStorage on boot)
- All renders flow through `renderAll()` → `renderBalance()`, `renderList()`, `updateChart()`
- Transactions are plain objects: `{ id, name, amount, category, date }`
- IDs use `crypto.randomUUID()`
- Currency formatted with `formatCurrency()` using `id-ID` locale (Rp)
- HTML output always escaped via `escapeHtml()` to prevent XSS
- LocalStorage key: `budget_tracker_transactions`

### CSS
- All design tokens are CSS custom properties on `:root` (colors, radius, shadow, transition)
- Category colors: Food `#f97316`, Transport `#3b82f6`, Fun `#a855f7`
- Animations: `slideIn` for new items, `slideOut` for deleted items, `bump` for balance update
- Max container width: 480px (mobile-first, centered on desktop)

### Categories
Exactly three categories are supported: **Food**, **Transport**, **Fun**. Do not add more without updating `CATEGORY_COLORS` in `app.js` and the `<select>` in `index.html`.

## Do's and Don'ts
- ✅ Keep everything in the three existing files unless a strong reason exists to split
- ✅ Validate all form inputs before processing
- ✅ Always call `saveToStorage()` after mutating `transactions`
- ✅ Always call `renderAll()` after any state change
- ❌ No npm, no bundlers, no build steps — must open as a plain HTML file
- ❌ No inline `<script>` or `<style>` blocks — keep JS and CSS in their own files
- ❌ No backend calls or external APIs beyond the Chart.js CDN
