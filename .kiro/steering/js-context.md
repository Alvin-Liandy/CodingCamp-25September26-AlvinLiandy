---
inclusion: fileMatch
fileMatchPattern: "**/*.js"
---

# JavaScript Context (auto-loaded for .js files)

## State Management Pattern
```js
// Single source of truth
let transactions = loadFromStorage(); // array of transaction objects

// After every mutation:
saveToStorage();   // persist to LocalStorage
renderAll();       // sync UI
```

## Transaction Shape
```js
{
  id:       string,   // crypto.randomUUID()
  name:     string,   // user input, trimmed
  amount:   number,   // positive float
  category: string,   // 'Food' | 'Transport' | 'Fun'
  date:     string,   // ISO 8601
}
```

## Render Pipeline
```
renderAll()
  ├── renderBalance()   // updates #totalBalance, triggers bump animation
  ├── renderList()      // rebuilds #transactionList DOM
  └── updateChart()     // updates Chart.js pie chart data
```

## Chart.js Notes
- Chart instance stored in `spendingChart` (module-level)
- Initialized once in `initChart()` on DOMContentLoaded
- Updated via `spendingChart.data.labels`, `.datasets[0].data`, `.datasets[0].backgroundColor` then `.update()`
- Canvas hidden and placeholder shown when no transactions exist

## Utility Functions
| Function | Purpose |
|---|---|
| `formatCurrency(value)` | Returns `Rp X` formatted with `id-ID` locale |
| `escapeHtml(str)` | Escapes `& < > " '` — always use before injecting user strings into HTML |
| `saveToStorage()` | JSON.stringify → localStorage |
| `loadFromStorage()` | JSON.parse ← localStorage, returns `[]` on error |
