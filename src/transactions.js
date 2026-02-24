import { getAccounts, saveAccounts, getCategories, getTransactions, saveTransactions } from './storage.js';

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);
}

export function renderTransactions(container) {
  const accounts = getAccounts();
  const categories = getCategories();
  const transactions = getTransactions();
  const today = new Date().toISOString().slice(0, 10);

  if (accounts.length === 0) {
    container.innerHTML = `
      <section class="card">
        <p class="empty">Primero agrega una cuenta en la pestaña Cuentas.</p>
      </section>
    `;
    return;
  }

  const accountMap = Object.fromEntries(accounts.map((a) => [a.id, a]));
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));

  container.innerHTML = `
    <section class="card">
      <h2>Agregar transacción</h2>
      <form id="tx-form" class="form-grid">
        <div class="form-group">
          <label for="tx-account">Cuenta</label>
          <select id="tx-account" required>
            ${accounts.map((a) => `<option value="${a.id}">${a.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="tx-category">Categoría</label>
          <select id="tx-category">
            <option value="">Sin categoría</option>
            ${categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="tx-type">Tipo</label>
          <select id="tx-type">
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </div>
        <div class="form-group">
          <label for="tx-amount">Monto</label>
          <input type="number" id="tx-amount" placeholder="0.00" step="0.01" min="0.01" required />
        </div>
        <div class="form-group">
          <label for="tx-description">Descripción</label>
          <input type="text" id="tx-description" placeholder="Opcional" autocomplete="off" />
        </div>
        <div class="form-group">
          <label for="tx-date">Fecha</label>
          <input type="date" id="tx-date" value="${today}" required />
        </div>
        <button type="submit" class="btn-full">Agregar</button>
      </form>
    </section>

    <section class="card">
      <h2>Transacciones</h2>
      ${
        sorted.length === 0
          ? '<p class="empty">No hay transacciones. Agrega una arriba.</p>'
          : `<ul class="item-list">
              ${sorted
                .map((tx) => {
                  const accName = accountMap[tx.accountId]?.name ?? 'Cuenta eliminada';
                  const catName = tx.categoryId && categoryMap[tx.categoryId]?.name;
                  const desc = tx.description || 'Sin descripción';
                  const sign = tx.type === 'ingreso' ? '+' : '-';
                  return `
                  <li>
                    <div class="tx-info">
                      <span class="tx-desc">${desc}</span>
                      <span class="tx-meta">${accName}${catName ? ` · ${catName}` : ''} · ${tx.date}</span>
                    </div>
                    <div class="tx-right">
                      <span class="tx-amount ${tx.type}">${sign}${formatCurrency(tx.amount)}</span>
                      <button class="btn-delete" data-id="${tx.id}">Eliminar</button>
                    </div>
                  </li>`;
                })
                .join('')}
            </ul>`
      }
    </section>
  `;

  container.querySelector('#tx-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const accountId = container.querySelector('#tx-account').value;
    const categoryId = container.querySelector('#tx-category').value || null;
    const type = container.querySelector('#tx-type').value;
    const amount = parseFloat(container.querySelector('#tx-amount').value);
    const description = container.querySelector('#tx-description').value.trim();
    const date = container.querySelector('#tx-date').value;

    if (!accountId || isNaN(amount) || amount <= 0) return;

    const txList = getTransactions();
    txList.push({ id: crypto.randomUUID(), accountId, categoryId, type, amount, description, date });
    saveTransactions(txList);

    const accList = getAccounts();
    const acc = accList.find((a) => a.id === accountId);
    if (acc) {
      acc.balance = type === 'ingreso' ? acc.balance + amount : acc.balance - amount;
      saveAccounts(accList);
    }

    renderTransactions(container);
  });

  container.querySelectorAll('.btn-delete[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const txList = getTransactions();
      const tx = txList.find((t) => t.id === id);

      if (tx) {
        const accList = getAccounts();
        const acc = accList.find((a) => a.id === tx.accountId);
        if (acc) {
          acc.balance = tx.type === 'ingreso' ? acc.balance - tx.amount : acc.balance + tx.amount;
          saveAccounts(accList);
        }
      }

      saveTransactions(txList.filter((t) => t.id !== id));
      renderTransactions(container);
    });
  });
}
