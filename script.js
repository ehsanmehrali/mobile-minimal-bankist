'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const updateUI = function () {
  // display movements
  displayMovements(currentAccount.movements);

  // display balance
  calcDisplayBalance(currentAccount);

  // display summary
  calcDisplaySummary(currentAccount);
};
/////////////////////////////////////////////////
// displaying Movements
// 148 - Creating DOM Elements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  // sorting condition
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 0
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
/////////////////////////////////////////////////
// Displaying Balance
// 154 - The reduce Method - reduce()
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accum, mov) => accum + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
/////////////////////////////////////////////////
// Displaying Summary
// 156 - The magic of chaining Methods
const calcDisplaySummary = function (acc) {
  // Incomes Summary(deposits summary)
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((accum, dep) => accum + dep, 0);
  labelSumIn.textContent = `${incomes} €`;
  // Withdrew Summary
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((accum, dep) => accum + dep, 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;
  // intrest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(dep => (dep * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((accum, int) => accum + int, 0);
  labelSumInterest.textContent = `${interest} €`;
};
/////////////////////////////////////////////////
// 152 - Computing Username
const createUserName = accs =>
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
createUserName(accounts);
// console.log(accounts);

/////////////////////////////////////////////////
// 159 - Implementing Login
// Login Event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  // finding current account username
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // check pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and message
    labelWelcome.textContent = `Welcom back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // clear inputs fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

/////////////////////////////////////////////////
// 160 - Implementing Transfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const reccieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    reccieverAcc &&
    reccieverAcc !== currentAccount.username &&
    amount > 0 &&
    amount <= currentAccount.balance
  ) {
    currentAccount.movements.push(-amount);
    reccieverAcc.movements.push(amount);
    inputTransferTo.value = inputTransferAmount.value = '';
    updateUI(currentAccount);
  }
});
/////////////////////////////////////////////////
// 162 - some and every
// Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loan = Number(inputLoanAmount.value);
  if (loan > 0 && currentAccount.movements.some(mov => mov >= loan * 0.1)) {
    currentAccount.movements.push(loan);
    inputLoanAmount.value = '';
    updateUI(currentAccount);
  }
});

/////////////////////////////////////////////////
// 161 - The findIndex Method
// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    // clear UI
    containerApp.style.opacity = 0;
  }
  // clear inputs fields
  inputCloseUsername.value = inputClosePin.value = '';
});
/////////////////////////////////////////////////
// sorting button
let sortBtnStatus = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sortBtnStatus);
  sortBtnStatus = !sortBtnStatus;
});
