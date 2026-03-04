import './style.css';
import { renderCategories } from './categories.js';
import { renderAccounts } from './accounts.js';
import { renderTransactions } from './transactions.js';
import { renderInsights } from './insights-ui.js';

const tabs = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');

const categoriesContainer = document.getElementById('panel-categories');
const accountsContainer = document.getElementById('panel-accounts');
const transactionsContainer = document.getElementById('panel-transactions');
const insightsContainer = document.getElementById('panel-insights');

function activateTab(tabId) {
  tabs.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tabId));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === `panel-${tabId}`));
}

tabs.forEach((btn) => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

renderCategories(categoriesContainer);
renderAccounts(accountsContainer);
renderTransactions(transactionsContainer);
renderInsights(insightsContainer);

activateTab('categories');
