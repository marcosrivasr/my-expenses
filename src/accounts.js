import { getAccounts, saveAccounts } from './storage.js';

const TYPE_LABELS = {
  cuenta: 'Cuenta',
  tarjeta: 'Tarjeta de crédito',
};

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);
}

export function renderAccounts(container) {
  const accounts = getAccounts();

  container.innerHTML = `
    <section class="card">
      <h2>Agregar cuenta / tarjeta</h2>
      <form id="account-form" class="form-grid">
        <div class="form-group">
          <label for="account-name">Nombre</label>
          <input
            type="text"
            id="account-name"
            placeholder="Ej. BBVA débito"
            required
            autocomplete="off"
          />
        </div>
        <div class="form-group">
          <label for="account-type">Tipo</label>
          <select id="account-type">
            <option value="cuenta">Cuenta</option>
            <option value="tarjeta">Tarjeta de crédito</option>
          </select>
        </div>
        <div class="form-group">
          <label for="account-balance">Saldo inicial</label>
          <input
            type="number"
            id="account-balance"
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>
        <button type="submit" class="btn-full">Agregar</button>
      </form>
    </section>

    <section class="card">
      <h2>Cuentas / Tarjetas</h2>
      ${
        accounts.length === 0
          ? '<p class="empty">No hay cuentas. Agrega una arriba.</p>'
          : `<ul class="item-list">
              ${accounts
                .map(
                  (acc) => `
                <li>
                  <div class="account-info">
                    <span class="account-name">${acc.name}</span>
                    <span class="account-type tag">${TYPE_LABELS[acc.type] ?? acc.type}</span>
                  </div>
                  <div class="account-right">
                    <span class="account-balance">${formatCurrency(acc.balance)}</span>
                    <button class="btn-delete" data-id="${acc.id}">Eliminar</button>
                  </div>
                </li>`
                )
                .join('')}
            </ul>`
      }
    </section>
  `;

  container.querySelector('#account-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = container.querySelector('#account-name').value.trim();
    const type = container.querySelector('#account-type').value;
    const balance = parseFloat(container.querySelector('#account-balance').value);

    if (!name || isNaN(balance)) return;

    const list = getAccounts();
    list.push({ id: crypto.randomUUID(), name, type, balance });
    saveAccounts(list);
    renderAccounts(container);
  });

  container.querySelectorAll('.btn-delete[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const list = getAccounts().filter((a) => a.id !== id);
      saveAccounts(list);
      renderAccounts(container);
    });
  });
}
