import { transactionsData } from "../transactions-data.js";
import { toTitleCaseWord, formatDate } from '../utils/utils.js';
import { updateStats } from '../stats.js';

export let transactionsDataState = [...transactionsData] || [];
const transactionsTableEl = document.getElementById('transactions-table');
let currentFilter = 'all';

//FILTER TRANSACTIONS TABLE
const filterOptionsEl = document.getElementById('filter-controls-transactions-table').children;
const filterOptionLabels = ["All", "Income", "Expense"];

function updateFilterOptions() {

    for(let i = 0; i < filterOptionsEl.length; i++) {
        const field = filterOptionsEl[i].children[0];
        const label = filterOptionsEl[i].children[1];
        const { count } = filterTransactionsData(field.value);
        
        label.innerText = count ? `${filterOptionLabels[i]} · ${count}` : filterOptionLabels[i];
    }
}

for(let option of filterOptionsEl) {
    const field = option.children[0];

    field.addEventListener('click', () => {
        renderTransactionTable(field.value);
        currentFilter = field.value;
    });

}

//RENDER TRANSACTIONS TABLE
function getTransactionRowEl(transactionData) {
    const transactionRowContainer = document.createElement('DIV');
    const iconName = transactionData.type === 'income' ? 'plus-circle': 'minus-circle';
    const formatTransactionAmount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    transactionRowContainer.classList.add("row-transactions-table", `${transactionData.type}`);

    transactionRowContainer.innerHTML = `<p class="description-transaction">${transactionData.title}</p>
    <div class="date-transaction">
        <svg class="icon-date-transaction">
            <use
            xlink:href="assets/icons.svg#calendar"
            />
        </svg>
        <span>${formatDate(transactionData.date)}</span>
    </div>
    <div class="type-transaction">
        <svg class="icon-type-transaction">
            <use
            xlink:href="assets/icons.svg#${iconName}"
            />
        </svg>
        <span>${toTitleCaseWord(transactionData.type)}</span>
    </div>
    <strong class="amount-transaction">${formatTransactionAmount.format(transactionData.amount)}</strong>`;

    return transactionRowContainer;
}

export function filterTransactionsData(filter) {
    const transactions = filter === 'all'
        ? transactionsDataState
        : transactionsDataState.filter(transaction => transaction.type === filter);

    return {transactions, count: transactions.length};
}

function renderTransactionTable(filter, data=filterTransactionsData(filter)) {
    transactionsTableEl.innerHTML = "";
    const { transactions } = data;

    transactions.forEach(transaction => {
        let row = getTransactionRowEl(transaction);
        transactionsTableEl.append(row);
    });
}

//ADD NEW TRANSACTION
export function addNewTransaction(data) {
    transactionsDataState = [...transactionsDataState, data];

    updateFilterOptions();
    renderTransactionTable(currentFilter);
    updateStats();
}

updateFilterOptions();
renderTransactionTable(currentFilter);