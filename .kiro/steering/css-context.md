---
inclusion: fileMatch
fileMatchPattern: "**/*.css"
---

# CSS Context (auto-loaded for .css files)

## Design Tokens (`:root`)
```css
--clr-bg:          #f0f2f5   /* page background */
--clr-surface:     #ffffff   /* card background */
--clr-primary:     #6c63ff   /* primary action color */
--clr-primary-dk:  #574fd6   /* primary hover */
--clr-danger:      #ef4444   /* delete / error */
--clr-danger-dk:   #dc2626   /* delete hover */
--clr-text:        #1e1e2e   /* body text */
--clr-muted:       #6b7280   /* secondary text */
--clr-border:      #e5e7eb   /* borders */

--cat-food:        #f97316
--cat-transport:   #3b82f6
--cat-fun:         #a855f7

--radius:          12px
--shadow:          0 2px 12px rgba(0,0,0,0.08)
--transition:      0.2s ease
```

## Key Classes
| Class | Description |
|---|---|
| `.app-container` | Max-width 480px wrapper, centered |
| `.header` | Gradient banner with balance |
| `.card` | White surface with shadow and radius |
| `.form-group` | Label + input + error message stack |
| `.transaction-item` | Single row in the list |
| `.category-dot` | Colored circle; add `.Food`, `.Transport`, or `.Fun` |
| `.btn-primary` | Full-width submit button |
| `.btn-delete` | Icon-only delete button |
| `.error-msg` | Hidden by default; add `.visible` to show |
| `.list-empty` | Hidden by default; add `.visible` to show |
| `.chart-empty` | Hidden by default; add `.visible` to show |

## Animations
- `slideIn` — new transaction items fade+slide down
- `slideOut` — deleted items slide right and fade (add `.removing` class)
- `bump` — balance amount scales up briefly (toggled via JS)
