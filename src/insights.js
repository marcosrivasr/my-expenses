// Filter helper — use in all functions before processing
function validTx(tx) {
  return (
    tx &&
    (tx.type === 'gasto' || tx.type === 'ingreso') &&
    typeof tx.amount === 'number' &&
    tx.amount > 0 &&
    typeof tx.date === 'string' &&
    tx.date.length >= 7
  );
}

export function getMonthlySummary(transactions, yearMonth) {
  const txs = transactions.filter(t => validTx(t) && t.date.startsWith(yearMonth));
  const totalIncome = txs.filter(t => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = txs.filter(t => t.type === 'gasto').reduce((s, t) => s + t.amount, 0);
  return { totalIncome, totalExpenses, net: totalIncome - totalExpenses };
}

export function getDailyTotalsForMonth(transactions, yearMonth) {
  const txs = transactions.filter(t => validTx(t) && t.date.startsWith(yearMonth));
  const map = {};
  txs.forEach(t => {
    if (!map[t.date]) map[t.date] = { income: 0, expenses: 0 };
    if (t.type === 'ingreso') map[t.date].income += t.amount;
    else map[t.date].expenses += t.amount;
  });
  return Object.entries(map)
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getTopExpenses(transactions, accounts, categories, n = 5) {
  const categoryMap = Object.fromEntries((categories || []).map(c => [c.id, c.name]));
  const txs = transactions.filter(t => validTx(t) && t.type === 'gasto');
  const grouped = {};
  txs.forEach(t => {
    const key = t.categoryId || '__none__';
    const name = t.categoryId ? (categoryMap[t.categoryId] || 'Sin categoria') : 'Sin categoria';
    if (!grouped[key]) grouped[key] = { categoryName: name, total: 0 };
    grouped[key].total += t.amount;
  });
  return Object.values(grouped).sort((a, b) => b.total - a.total).slice(0, n);
}

export function getTopIncome(transactions, accounts, categories, n = 5) {
  const categoryMap = Object.fromEntries((categories || []).map(c => [c.id, c.name]));
  const txs = transactions.filter(t => validTx(t) && t.type === 'ingreso');
  const grouped = {};
  txs.forEach(t => {
    const key = t.categoryId || '__none__';
    const name = t.categoryId ? (categoryMap[t.categoryId] || 'Sin categoria') : 'Sin categoria';
    if (!grouped[key]) grouped[key] = { categoryName: name, total: 0 };
    grouped[key].total += t.amount;
  });
  return Object.values(grouped).sort((a, b) => b.total - a.total).slice(0, n);
}
