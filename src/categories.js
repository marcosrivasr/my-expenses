import { getCategories, saveCategories } from "./storage.js";

export function renderCategories(container) {
  const categories = getCategories();

  container.innerHTML = `
    <section class="card">
      <h2>Agregar categoría</h2>
      <form id="category-form" class="form-row">
        <input
          type="text"
          id="category-name"
          placeholder="Nombre de la categoría"
          required
          autocomplete="off"
        />
        <button type="submit">Agregar</button>
      </form>
    </section>

    <section class="card">
      <h2>Categorías</h2>
      ${
        categories.length === 0
          ? '<p class="empty">No hay categorías. Agrega una arriba.</p>'
          : `<ul class="item-list">
              ${categories
                .map(
                  (cat) => `
                <li>
                  <span>${cat.name}</span>
                  <button class="btn-delete" data-id="${cat.id}">Editar</button>
                  <button class="btn-delete" data-id="${cat.id}">Eliminar</button>
                </li>`,
                )
                .join("")}
            </ul>`
      }
    </section>
  `;

  container.querySelector("#category-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = container.querySelector("#category-name");
    const name = input.value.trim();
    if (!name) return;

    const list = getCategories();
    list.push({ id: crypto.randomUUID(), name });
    saveCategories(list);
    renderCategories(container);
  });

  container.querySelectorAll(".btn-delete[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const list = getCategories().filter((c) => c.id !== id);
      saveCategories(list);
      renderCategories(container);
    });
  });
}
