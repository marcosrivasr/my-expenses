# AGENTS.md — Mis Gastos

Guia para agentes de IA que contribuyan a este proyecto.

## Overview

"Mis Gastos" es una aplicacion web de gestion de gastos personales. Permite gestionar categorias, cuentas, transacciones y ver insights de gastos e ingresos.

## Stack

- **Vite + Vanilla JS** — sin frameworks ni librerias externas
- **localStorage** para persistencia de datos
- Sin backend, sin base de datos, sin dependencias de runtime

## Arquitectura

```
my-expenses/
├── index.html         ← Layout con 4 tabs (Categorias, Cuentas, Transacciones, Insights)
├── package.json
├── vite.config.js
└── src/
    ├── main.js        ← Tab switching + render inicial de los 4 panels
    ├── style.css      ← CSS variables, tema claro
    ├── storage.js     ← Helpers de localStorage
    ├── categories.js  ← renderCategories(container)
    ├── accounts.js    ← renderAccounts(container)
    ├── transactions.js← renderTransactions(container)
    ├── insights.js    ← Funciones puras de analisis
    └── insights-ui.js ← renderInsights(container)
```

## Modulos

### main.js
Tab switching y render inicial. Importa las funciones `render*` de cada modulo y las conecta con los tabs del DOM.

### storage.js
Helpers de localStorage. Funciones principales:
- `getCategories()` / `saveCategories(data)`
- `getAccounts()` / `saveAccounts(data)`
- `getTransactions()` / `saveTransactions(data)`

Keys de localStorage:
- `my-expenses-categories`
- `my-expenses-accounts`
- `my-expenses-transactions`

### categories.js
Exporta `renderCategories(container)`. Gestiona CRUD de categorias de gastos/ingresos.

### accounts.js
Exporta `renderAccounts(container)`. Gestiona CRUD de cuentas (efectivo, banco, etc.).

### transactions.js
Exporta `renderTransactions(container)`. Gestiona CRUD de transacciones vinculadas a categorias y cuentas.

### insights.js
Funciones puras de analisis (sin DOM). Exporta:
- `getMonthlySummary(transactions, year, month)` — resumen mensual de ingresos/gastos
- `getDailyTotalsForMonth(transactions, year, month)` — totales diarios para un mes
- `getTopExpenses(transactions, year, month)` — top gastos del mes
- `getTopIncome(transactions, year, month)` — top ingresos del mes

### insights-ui.js
Exporta `renderInsights(container)`. Renderiza graficas y tablas de insights usando las funciones de `insights.js`.

## Patrones de Codigo

- **Re-render completo**: cada modulo exporta `render*(container)` que limpia y reconstruye todo el contenido del container en cada cambio. No hay diffing ni estado reactivo.
- **UUIDs**: usar `crypto.randomUUID()` para generar identificadores unicos.
- **Formato de moneda**: `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`.
- **Sin frameworks**: todo es DOM nativo (`createElement`, `innerHTML`, event listeners manuales).
- **Funciones puras**: la logica de negocio (como en `insights.js`) debe ser pura — sin efectos secundarios ni acceso al DOM.

## Convenciones

- Idioma de la UI: espanol
- Idioma del codigo (variables, funciones): ingles
- No agregar dependencias externas sin autorizacion explicita
- No introducir frameworks (React, Vue, etc.)
- Mantener la persistencia en localStorage
- CSS con variables custom en `:root` dentro de `style.css`
- Un archivo JS por modulo/funcionalidad

## Como contribuir (para agentes IA)

1. **Leer antes de modificar**: siempre leer el archivo completo antes de editarlo.
2. **Seguir el patron existente**: nuevas funcionalidades deben exportar `render*(container)` y seguir el mismo patron de re-render completo.
3. **Storage centralizado**: toda interaccion con localStorage debe pasar por `storage.js`. Si necesitas una nueva key, agrega helpers ahi.
4. **No sobre-ingenieria**: soluciones simples y directas. No agregar abstracciones innecesarias.
5. **Probar con `npm run dev`**: el servidor de desarrollo corre en http://localhost:5173.
6. **Commits atomicos**: un commit por cambio logico, mensaje descriptivo en ingles.
