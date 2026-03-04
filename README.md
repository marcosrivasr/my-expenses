# Mis Gastos

Aplicacion web de gestion de gastos personales. Permite organizar categorias, cuentas bancarias, registrar transacciones y visualizar un analisis de los movimientos financieros.

## Caracteristicas

La aplicacion se organiza en 4 pestanas principales:

- **Categorias** — Crear y administrar categorias de gasto (ej. Comida, Transporte, Entretenimiento).
- **Cuentas** — Registrar cuentas bancarias o de efectivo con su saldo inicial.
- **Transacciones** — Registrar ingresos y egresos asociados a una cuenta y categoria, con sincronizacion automatica del saldo.
- **Analisis** — Visualizar un resumen de gastos por categoria y periodo para entender los patrones de gasto.

## Stack tecnologico

- **Vite** — Bundler y servidor de desarrollo.
- **Vanilla JS** — Sin frameworks ni librerias de UI.
- **localStorage** — Persistencia de datos en el navegador, sin backend.
- **Vitest** — Tests unitarios.
- **Moneda** — MXN (Peso mexicano) formateado con `Intl.NumberFormat`.

## Estructura de archivos

```
my-expenses/
├── index.html            ← Layout principal con las 4 pestanas
├── package.json
├── vite.config.js
└── src/
    ├── main.js           ← Cambio de pestanas e inicializacion del render
    ├── style.css          ← Variables CSS y tema visual
    ├── storage.js         ← Helpers para leer/escribir en localStorage
    ├── categories.js      ← renderCategories(container)
    ├── accounts.js        ← renderAccounts(container)
    ├── transactions.js    ← renderTransactions(container)
    ├── insights.js        ← Logica de calculo para el analisis
    ├── insights-ui.js     ← renderInsights(container)
    └── insights.test.js   ← Tests unitarios para insights
```

## Instalacion y uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicacion estara disponible en `http://localhost:5173`.

## Scripts

| Comando              | Descripcion              |
| -------------------- | ------------------------ |
| `npm run dev`        | Servidor de desarrollo   |
| `npm run build`      | Build de produccion      |
| `npm run preview`    | Preview del build        |
| `npm run test`       | Ejecutar tests unitarios |

## Arquitectura

### Patron de modulos

Cada modulo exporta una funcion `render*(container)` que recibe el contenedor DOM y genera todo el HTML necesario. Cada vez que hay un cambio de datos se ejecuta un re-render completo del modulo activo.

### Claves de localStorage

| Clave | Contenido |
|---|---|
| `my-expenses-categories` | Lista de categorias |
| `my-expenses-accounts` | Lista de cuentas con saldo |
| `my-expenses-transactions` | Lista de transacciones |

### Identificadores

Se generan IDs unicos con `crypto.randomUUID()`.

### Formato de moneda

Los montos se formatean con `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })` → `$1,234.56`.
