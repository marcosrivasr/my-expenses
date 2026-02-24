const KEYS = {
  categories: 'my-expenses-categories',
  accounts: 'my-expenses-accounts',
};

export function getCategories() {
  return JSON.parse(localStorage.getItem(KEYS.categories) || '[]');
}

export function saveCategories(list) {
  localStorage.setItem(KEYS.categories, JSON.stringify(list));
}

export function getAccounts() {
  return JSON.parse(localStorage.getItem(KEYS.accounts) || '[]');
}

export function saveAccounts(list) {
  localStorage.setItem(KEYS.accounts, JSON.stringify(list));
}
