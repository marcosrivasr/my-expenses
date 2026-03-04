import { getTransactions, getAccounts, getCategories } from './storage.js';
import { getDailyTotalsForMonth, getTopExpenses, getTopIncome, getMonthlySummary } from './insights.js';

const fmt = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

function fmtAxisValue(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${Math.round(n)}`;
}

let selectedMonth = new Date().toISOString().slice(0, 7);

function drawChart(canvas, dailyData, yearMonth) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth || 600;
  const cssHeight = 220;
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  ctx.scale(dpr, dpr);

  const pad = { top: 36, right: 20, bottom: 44, left: 56 };
  const chartW = cssWidth - pad.left - pad.right;
  const chartH = cssHeight - pad.top - pad.bottom;

  // Parse month
  const [y, m] = yearMonth.split('-').map(Number);
  const numDays = new Date(y, m, 0).getDate();

  // Build per-day arrays indexed 1..numDays
  const income = new Array(numDays + 1).fill(0);
  const expenses = new Array(numDays + 1).fill(0);
  dailyData.forEach(({ date, income: inc, expenses: exp }) => {
    const day = parseInt(date.slice(8, 10), 10);
    if (day >= 1 && day <= numDays) {
      income[day] = inc;
      expenses[day] = exp;
    }
  });

  const maxVal = Math.max(...income.slice(1), ...expenses.slice(1), 1);

  // Background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  // Grid lines (4 lines at 25%, 50%, 75%, 100%)
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const yPos = pad.top + chartH - (i / 4) * chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, yPos);
    ctx.lineTo(pad.left + chartW, yPos);
    ctx.stroke();
  }

  // Y-axis labels
  ctx.fillStyle = '#9ca3af';
  ctx.font = `11px system-ui, sans-serif`;
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const val = (i / 4) * maxVal;
    const yPos = pad.top + chartH - (i / 4) * chartH;
    ctx.fillText(fmtAxisValue(val), pad.left - 6, yPos + 4);
  }

  // X-axis line
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + chartH);
  ctx.lineTo(pad.left + chartW, pad.top + chartH);
  ctx.stroke();

  // Bars
  const slotW = chartW / numDays;
  const barW = Math.max(slotW * 0.32, 2);

  for (let d = 1; d <= numDays; d++) {
    const slotX = pad.left + (d - 1) * slotW;
    const centerX = slotX + slotW / 2;

    // Expense bar (left)
    if (expenses[d] > 0) {
      const h = (expenses[d] / maxVal) * chartH;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(centerX - barW - 1, pad.top + chartH - h, barW, h);
    }

    // Income bar (right)
    if (income[d] > 0) {
      const h = (income[d] / maxVal) * chartH;
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(centerX + 1, pad.top + chartH - h, barW, h);
    }
  }

  // X-axis labels (every 5 days + last day)
  ctx.fillStyle = '#9ca3af';
  ctx.font = `10px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  const labelDays = new Set([1, 5, 10, 15, 20, 25, numDays]);
  labelDays.forEach(d => {
    if (d > numDays) return;
    const x = pad.left + (d - 1) * slotW + slotW / 2;
    ctx.fillText(String(d), x, pad.top + chartH + 14);
  });

  // Legend
  const legendY = 14;
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(cssWidth - pad.right - 120, legendY - 8, 10, 10);
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Gastos', cssWidth - pad.right - 107, legendY);

  ctx.fillStyle = '#16a34a';
  ctx.fillRect(cssWidth - pad.right - 55, legendY - 8, 10, 10);
  ctx.fillStyle = '#6b7280';
  ctx.fillText('Ingresos', cssWidth - pad.right - 42, legendY);

  return true;
}

function buildTopList(items, type) {
  if (!items.length) {
    return `<p class="chart-empty" style="padding:1rem 0">Sin datos</p>`;
  }
  return items.map(({ categoryName, total }) => `
    <div class="top-item">
      <span class="name" title="${categoryName}">${categoryName}</span>
      <span class="amount ${type}">${fmt(total)}</span>
    </div>
  `).join('');
}

export function renderInsights(container) {
  const transactions = getTransactions();
  const accounts = getAccounts();
  const categories = getCategories();

  const monthTx = transactions.filter(t => t.date && t.date.startsWith(selectedMonth));
  const summary = getMonthlySummary(transactions, selectedMonth);
  const dailyData = getDailyTotalsForMonth(transactions, selectedMonth);
  const topExp = getTopExpenses(monthTx, accounts, categories);
  const topInc = getTopIncome(monthTx, accounts, categories);

  const hasData = dailyData.length > 0;

  container.innerHTML = `
    <div class="insights-header">
      <h2 style="margin:0">Análisis</h2>
      <div class="month-picker">
        <input type="month" id="month-picker" value="${selectedMonth}">
        <button class="btn-secondary" id="btn-current-month">Este mes</button>
      </div>
    </div>

    <div class="insights-summary">
      <div class="summary-card">
        <div class="label">Gastos</div>
        <div class="value expense">${fmt(summary.totalExpenses)}</div>
      </div>
      <div class="summary-card">
        <div class="label">Ingresos</div>
        <div class="value income">${fmt(summary.totalIncome)}</div>
      </div>
      <div class="summary-card">
        <div class="label">Balance</div>
        <div class="value ${summary.net >= 0 ? 'income' : 'expense'}">${fmt(Math.abs(summary.net))}</div>
      </div>
    </div>

    <div class="card">
      <div class="chart-wrapper">
        ${hasData
          ? `<canvas id="chart-canvas" style="height:220px"></canvas>`
          : `<div class="chart-empty">No hay transacciones en este período.</div>`
        }
      </div>
    </div>

    <div class="top-lists">
      <div class="top-list card">
        <h3>Top gastos</h3>
        ${buildTopList(topExp, 'expense')}
      </div>
      <div class="top-list card">
        <h3>Top ingresos</h3>
        ${buildTopList(topInc, 'income')}
      </div>
    </div>
  `;

  // Event listeners
  container.querySelector('#month-picker').addEventListener('change', (e) => {
    selectedMonth = e.target.value;
    renderInsights(container);
  });

  container.querySelector('#btn-current-month').addEventListener('click', () => {
    selectedMonth = new Date().toISOString().slice(0, 7);
    renderInsights(container);
  });

  // Draw chart after DOM is painted
  if (hasData) {
    const canvas = container.querySelector('#chart-canvas');
    if (canvas) {
      requestAnimationFrame(() => drawChart(canvas, dailyData, selectedMonth));
    }
  }
}
