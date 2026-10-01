/* ============================================================
   Expense & Budget Visualizer — app.js
   Vanilla JS · LocalStorage · Chart.js 4
   ============================================================ */

// ── Constants ──────────────────────────────────────────────
const STORAGE_KEY = 'budget_tracker_transactions';

const CATEGORY_COLORS = {
  Food:      '#f97316',
  Transport: '#3b82f6',
  Fun:       '#a855f7',
};

// ── State ──────────────────────────────────────────────────
let transactions = loadFromStorage();
let spendingChart = null;

// ── DOM References ─────────────────────────────────────────
const form          = document.getElementById('transactionForm');
const itemNameInput = document.getElementById('itemName');
const amountInput   = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const totalBalanceEl= document.getElementById('totalBalance');
const listEl        = document.getElementById('transactionList');
const listEmptyEl   = document.getElementById('listEmpty');
const chartEmptyEl  = document.getElementById('chartEmpty');
const chartCanvas   = document.getElementById('spendingChart');

const itemNameError = document.getElementById('itemNameError');
const amountError   = document.getElementById('amountError');
const categoryError = document.getElementById('categoryError');

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initChart();
  renderAll();

  form.addEventListener('submit', handleSubmit);
});

// ── Form Submission ────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();

  if (!validateForm()) return;

  const transaction = {
    id:       crypto.randomUUID(),
    name:     itemNameInput.value.trim(),
    amount:   parseFloat(amountInput.value),
    category: categoryInput.value,
    date:     new Date().toISOString(),
  };

  transactions.unshift(transaction); // newest first
  saveToStorage();
  renderAll();
  form.reset();
  clearErrors();
}

// ── Validation ─────────────────────────────────────────────
function validateForm() {
  let valid = true;

  // Item Name
  if (!itemNameInput.value.trim()) {
    showError(itemNameInput, itemNameError);
    valid = false;
  } else {
    clearError(itemNameInput, itemNameError);
  }

  // Amount
  const amt = parseFloat(amountInput.value);
  if (!amountInput.value || isNaN(amt) || amt <= 0) {
    showError(amountInput, amountError);
    valid = false;
  } else {
    clearError(amountInput, amountError);
  }

  // Category
  if (!categoryInput.value) {
    showError(categoryInput, categoryError);
    valid = false;
  } else {
    clearError(categoryInput, categoryError);
  }

  return valid;
}

function showError(input, msgEl) {
  input.classList.add('invalid');
  msgEl.classList.add('visible');
}

function clearError(input, msgEl) {
  input.classList.remove('invalid');
  msgEl.classList.remove('visible');
}

function clearErrors() {
  clearError(itemNameInput, itemNameError);
  clearError(amountInput, amountError);
  clearError(categoryInput, categoryError);
}

// ── Render All ─────────────────────────────────────────────
function renderAll() {
  renderBalance();
  renderList();
  updateChart();
}

// ── Balance ────────────────────────────────────────────────
function renderBalance() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const formatted = formatCurrency(total);

  totalBalanceEl.textContent = formatted;
  totalBalanceEl.classList.remove('bump');
  // Force reflow to retrigger animation
  void totalBalanceEl.offsetWidth;
  totalBalanceEl.classList.add('bump');
}

// ── Transaction List ───────────────────────────────────────
function renderList() {
  listEl.innerHTML = '';

  if (transactions.length === 0) {
    listEmptyEl.classList.add('visible');
    return;
  }

  listEmptyEl.classList.remove('visible');

  transactions.forEach(t => {
    const li = createTransactionItem(t);
    listEl.appendChild(li);
  });
}

function createTransactionItem(t) {
  const li = document.createElement('li');
  li.className = 'transaction-item';
  li.dataset.id = t.id;

  li.innerHTML = `
    <span class="category-dot ${t.category}" aria-hidden="true"></span>
    <div class="item-details">
      <div class="item-name" title="${escapeHtml(t.name)}">${escapeHtml(t.name)}</div>
      <div class="item-category">${t.category}</div>
    </div>
    <span class="item-amount">- ${formatCurrency(t.amount)}</span>
    <button
      class="btn-delete"
      aria-label="Delete ${escapeHtml(t.name)}"
      data-id="${t.id}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
      </svg>
    </button>
  `;

  li.querySelector('.btn-delete').addEventListener('click', () => deleteTransaction(t.id, li));

  return li;
}

// ── Delete ─────────────────────────────────────────────────
function deleteTransaction(id, liEl) {
  liEl.classList.add('removing');

  liEl.addEventListener('animationend', () => {
    transactions = transactions.filter(t => t.id !== id);
    saveToStorage();
    renderAll();
  }, { once: true });
}

// ── Chart ──────────────────────────────────────────────────
function initChart() {
  const ctx = chartCanvas.getContext('2d');

  spendingChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 16,
            boxWidth: 12,
            font: { size: 13 },
            color: '#1e1e2e',
          }
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              const value = ctx.parsed;
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct   = ((value / total) * 100).toFixed(1);
              return ` ${formatCurrency(value)} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

function updateChart() {
  const totals = { Food: 0, Transport: 0, Fun: 0 };

  transactions.forEach(t => {
    if (totals[t.category] !== undefined) {
      totals[t.category] += t.amount;
    }
  });

  // Only show categories that have spending
  const activeCategories = Object.keys(totals).filter(cat => totals[cat] > 0);

  if (activeCategories.length === 0) {
    chartCanvas.style.display = 'none';
    chartEmptyEl.classList.add('visible');
  } else {
    chartCanvas.style.display = 'block';
    chartEmptyEl.classList.remove('visible');
  }

  spendingChart.data.labels = activeCategories;
  spendingChart.data.datasets[0].data            = activeCategories.map(cat => totals[cat]);
  spendingChart.data.datasets[0].backgroundColor = activeCategories.map(cat => CATEGORY_COLORS[cat]);
  spendingChart.update();
}

// ── LocalStorage ───────────────────────────────────────────
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('LocalStorage read failed:', e);
    return [];
  }
}

// ── Utilities ──────────────────────────────────────────────
function formatCurrency(value) {
  return 'Rp ' + value.toLocaleString('id-ID');
}

function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, ch => map[ch]);
}
