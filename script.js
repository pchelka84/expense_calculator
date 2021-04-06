const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount'); 
const error = document.getElementById('error-container');
const close = document.querySelector('.close');

// const dummyTransactions = [
//   {id: 1, text: "Flower", amount: -30},
//   {id: 2, text: "Salary", amount: 700},
//   {id: 3, text: "Book", amount: -20},
//   {id: 4, text: "Trip", amount: -200},
// ];

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    error.style.display = 'block';
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    }
    
    transactions.push(transaction);
    addTransactionDOM(transaction);
    
    closeErrorMessage(); 
    updateValues();
    updateLocalStorage();
    text.value = ''
    amount.value= '';
  }
}

// Generate random id 
function generateID() {
  return Math.floor(Math.random() * 100000000)
}

// Add transaction to DOm list
function addTransactionDOM(transaction) {
  // Get sign 
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

 // Add class based on value
 item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
 item.innerHTML = `
  ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
 `
 list.appendChild(item);
}

// Update balance, income, expense
function updateValues() {
  const amount = transactions.map(transaction => transaction.amount);
  const total = amount.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amount
                  .filter(item => item > 0)
                  .reduce((acc, item) => (acc+= item), 0)
                  .toFixed(2);
  const expense = (amount
                    .filter(item => item < 0)
                    .reduce((acc, item) => (acc+=item), 0) * - 1)
                    .toFixed(2);

  balance.innerHTML = `${total}`;
  moneyMinus.innerHTML = `${expense}`;
  moneyPlus.innerHTML = `${income}`;
}

// remove transaction by ID 
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update local storage transactions 
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Close error message 
function closeErrorMessage() {
  error.style.display ='';
}

// Init app 
function init() {
  list.innerHTML='';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
close.addEventListener('click', closeErrorMessage);