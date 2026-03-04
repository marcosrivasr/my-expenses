import { describe, it, expect } from 'vitest';
import {
  getMonthlySummary,
  getDailyTotalsForMonth,
  getTopExpenses,
  getTopIncome,
} from './insights.js';

const sampleTransactions = [
  { type: 'ingreso', amount: 5000, date: '2026-03-01', categoryId: 'cat1' },
  { type: 'ingreso', amount: 3000, date: '2026-03-15', categoryId: 'cat1' },
  { type: 'gasto', amount: 1200, date: '2026-03-02', categoryId: 'cat2' },
  { type: 'gasto', amount: 800, date: '2026-03-02', categoryId: 'cat3' },
  { type: 'gasto', amount: 500, date: '2026-03-10', categoryId: 'cat2' },
  { type: 'ingreso', amount: 2000, date: '2026-04-01', categoryId: 'cat1' },
  { type: 'gasto', amount: 300, date: '2026-04-05', categoryId: 'cat2' },
];

const categories = [
  { id: 'cat1', name: 'Salario' },
  { id: 'cat2', name: 'Comida' },
  { id: 'cat3', name: 'Transporte' },
];

describe('getMonthlySummary', () => {
  it('filtra correctamente por yearMonth y suma ingresos/gastos', () => {
    const result = getMonthlySummary(sampleTransactions, '2026-03');

    expect(result.totalIncome).toBe(8000);
    expect(result.totalExpenses).toBe(2500);
    expect(result.net).toBe(5500);
  });

  it('ignora transacciones invalidas (amount negativo, type incorrecto)', () => {
    const txs = [
      { type: 'ingreso', amount: 1000, date: '2026-03-01', categoryId: 'cat1' },
      { type: 'ingreso', amount: -500, date: '2026-03-01', categoryId: 'cat1' },
      { type: 'otro', amount: 200, date: '2026-03-01', categoryId: 'cat1' },
      { type: 'gasto', amount: 0, date: '2026-03-01', categoryId: 'cat2' },
      null,
      undefined,
      { type: 'gasto', amount: 300, date: '2026-03-05', categoryId: 'cat2' },
    ];

    const result = getMonthlySummary(txs, '2026-03');

    expect(result.totalIncome).toBe(1000);
    expect(result.totalExpenses).toBe(300);
    expect(result.net).toBe(700);
  });
});

describe('getDailyTotalsForMonth', () => {
  it('agrupa por fecha y ordena cronologicamente', () => {
    const result = getDailyTotalsForMonth(sampleTransactions, '2026-03');

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ date: '2026-03-01', income: 5000, expenses: 0 });
    expect(result[1]).toEqual({ date: '2026-03-02', income: 0, expenses: 2000 });
    expect(result[2]).toEqual({ date: '2026-03-10', income: 0, expenses: 500 });
    expect(result[3]).toEqual({ date: '2026-03-15', income: 3000, expenses: 0 });
  });
});

describe('getTopExpenses', () => {
  it('retorna top N categorias por monto de gasto', () => {
    const result = getTopExpenses(sampleTransactions, [], categories, 2);

    expect(result).toHaveLength(2);
    expect(result[0].categoryName).toBe('Comida');
    expect(result[0].total).toBe(2000);
    expect(result[1].categoryName).toBe('Transporte');
    expect(result[1].total).toBe(800);
  });
});

describe('getTopIncome', () => {
  it('retorna top N categorias por monto de ingreso', () => {
    const result = getTopIncome(sampleTransactions, [], categories, 3);

    expect(result).toHaveLength(1);
    expect(result[0].categoryName).toBe('Salario');
    expect(result[0].total).toBe(10000);
  });
});
