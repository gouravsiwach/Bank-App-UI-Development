"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Event handlers
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //add Amount
    currentAccount.movements.push(amount);

    //Update UI

    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/*
const user = "Steve Thomas Williams";
const userName = user
  .toLowerCase()
  .split(" ")
  .map((name) => name[0])
  .join("");
console.log(userName);
*/
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//const currencies = new Map([
//["USD", "United States dollar"],
//["EUR", "Euro"],
//["GBP", "Pound sterling"],
//]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
const arr = ["a", "b", "c", "d", "e"];

console.log(arr.slice(1)); //["c", "d", "e"]
console.log(arr.slice(2, 4)); //["c", "d"]

console.log(arr.slice(-2)); //["d","e"]
console.log(arr.slice(-1)); //["e"]

console.log(arr.slice(1, -2)); //["b","c"]

console.log(...arr);

//splice Method

//console.log(arr.splice(2)); //['c', 'd', 'e']
//console.log(arr); //["a","b"]

console.log(arr.splice(-1)); //["e"]
console.log(arr); //['a', 'b', 'c', 'd']

arr.splice(1, 2);
console.log(arr); //["a","d"]

//Reverse

const arr2 = ["j", "i", "h", "g", "f"];

console.log(arr2.reverse());
console.log(arr2); //changes the original value

//Concat
const arr1 = ["a", "b", "c", "d", "e"];
const letters = arr1.concat(arr2);

console.log(letters);
console.log(...arr1, ...arr2);

//Join
console.log(letters.join("-"));
*/
/*
//The New "AT" Method

const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

//Getting last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);

console.log(arr.at(-1));

//"AT" Method always applicable for strings

console.log("Gourav".at(0));
console.log("Gourav".at(-1));

//Looping Array using forEach Method

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//for (const movement of movements)
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement:${i + 1} You deposited ${movement}`);
  } else {
    console.log(`movement:${i + 1} You Withdrew ${Math.abs(movement)}`);
  }
}

console.log("------forEach------");
//forEach Method

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement:${i + 1} You deposited ${mov}`);
  } else {
    console.log(`Movement:${i + 1} You Withdrew ${Math.abs(mov)}`);
  }
});

//forEach with Maps and Sets

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}:${value}`);
});

const currenciesUnique = new Set([
  "USD",
  "EUR",
  "GBP",
  "USD",
  "GBP",
  "EUR",
  "EUR",
  "USD",
  "GBP",
]);
console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}:${value}`);
});
*/
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUsd = 1.1;

const movementUsd = movements.map((mov) => mov * euroToUsd);
console.log(movements);
console.log(movementUsd);

const movementUsdFor = [];

for (const mov of movements) movementUsdFor.push(mov * euroToUsd);
console.log(movementUsdFor);
/*
const movementDescriptions = movements.map((mov, i, arr) => {
  if (mov > 0) {
    console.log(`Movement:${i + 1} You deposited ${mov}`);
  } else {
    console.log(`Movement:${i + 1} You Withdrew ${Math.abs(mov)}`);
  }
});
*/

const movementDescriptions = movements.map(
  (mov, i) =>
    `Movement: ${i + 1} you ${mov > 0 ? "deposited" : "withdrew"} ${Math.abs(
      mov
    )}`
);
console.log(movementDescriptions);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositeFor = [];
for (const mov of movements) {
  if (mov > 0) depositeFor.push(mov);
}
console.log(depositeFor);

const withdrew = movements.filter(function (mov) {
  return mov < 0;
});
console.log(withdrew);

const withdrewFor = [];
for (const mov of movements) {
  if (mov < 0) withdrewFor.push(mov);
}
console.log(withdrewFor);

//The Reduce Method

//const balance = movements.reduce(function (acc, curr, i, arr) {
//console.log(`Iteration${i}:${acc}`);
//return acc + curr;
//}, 0);
//console.log(balance);

const balance = movements.reduce((acc, curr) => acc + curr);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;

console.log(balance2);

//Maximum value

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
});
console.log(max);

//The Magic of channing Method

const totalDeposistsUsd = movements
  //.filter((mov) => mov > 0)
  .filter((mov) => mov > 0)
  .map((mov, i, arr) => {
    //console.log(arr);
    return mov * euroToUsd;
  })
  //.map((mov) => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDeposistsUsd);

//The Find Method

const firstWithdrwal = movements.find((mov) => mov < 0);
console.log(firstWithdrwal);

const account = accounts.find((acc) => acc.owner === "Jessica Davis");
console.log(account);

for (const account of accounts) {
  const account = accounts.find((acc, i) => acc.owner === [i]);
}
console.log(accounts[3]);

//The some and every Method

console.log(movements);
console.log(movements.includes(-130));

//condition

console.log(movements.some((mov) => mov === -130));

const anyDeposit = movements.some((mov) => mov > 0);
console.log(anyDeposit);

//Every Method

console.log(movements.every((mov) => mov > 0));

console.log(account4.movements.every((mov) => mov > 0));

//Seprate Callback

const deposit = (mov) => mov > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//Flat and Flat Map

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat()); //(8) [1, 2, 3, 4, 5, 6, 7, 8]

const arrDeep = [
  [[1, 2], 3],
  [4, [5, 6], 7, 8],
];
console.log(arrDeep.flat()); //(6) [Array(2), 3, 4, Array(2), 7, 8]
console.log(arrDeep.flat(2)); //8) [1, 2, 3, 4, 5, 6, 7, 8]

const accountsMovements = accounts.map((acc) => acc.movements);
console.log(accountsMovements);

const allMovements = accountsMovements.flat();
console.log(allMovements); //(29) [200, 450, -400, 3000, -650, -130, 70, 1300, 5000, 3400, -150, -790, -3210, -1000, 8500, -30, 200, -200, 340, -300, -20, 50, 400, -460, 430, 1000, 700, 50, 90]

const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

//Flat Map

const overallBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overallBalance2);

//Sorting Arrays

//Strings

const owners = ["Jonas", "zanch", "Adam", "Martha"];
console.log(owners.sort());
console.log(owners);

//Numbers

console.log(movements);
console.log(movements.sort());

// return < 0 a,b
//return >0 b,a

//Asending Order

movements.sort((a, b) => {
  if (a > b) return 1;
  if (b > a) return -1;
});
console.log(movements);

movements.sort((a, b) => a - b);
console.log(movements);

//Descending Order

movements.sort((a, b) => {
  if (a > b) return -1;
  if (b > a) return 1;
});
console.log(movements);

movements.sort((a, b) => b - a);
console.log(movements);

//More ways of creating and filling arrays

const arr1 = [1, 2, 3, 4, 5, 6, 7];

console.log([1, 2, 3, 4, 5, 6, 7]);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);

console.log(x.map(() => 5));

x.fill(1, 3, 5);
console.log(x);

arr1.fill(23, 4, 6);
console.log(arr1);

//Array from

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1); // "_" represnt throwway variable
console.log(z);

labelBalance.addEventListener("click", function () {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => el.textContent.replace("€", "")
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll(".movements__value")];
  console.log(movementsUI2);

  //console.log(movementsUI.map((el) => el.textContent.replace("€", "")));
});

// Array Method Practicing

//How Much total deposir in bank

// const bankDepositSum = accounts.map((acc) => acc.movements).flat();

const bankDepositSum = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 0)
  .reduce((sum, curr) => sum + curr);
console.log(bankDepositSum);

//How many Deposis less than 1000

/*
const numdepositsatlest1000 = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov >= 1000).length;
console.log(numdepositsatlest1000);
*/

const numdepositsatlest1000 = accounts
  .flatMap((acc) => acc.movements)
  //.reduce((count, curr) => (curr >= 1000 ? count + 1 : count), 0);
  .reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);
console.log(numdepositsatlest1000);

let a = 10;
//console.log(a++);//10
console.log(++a); //11
console.log(a);

const sums = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sum, curr) => {
      curr > 0 ? (sum.deposits += curr) : (sum.withdrawal += curr);

      //sum[curr > 0 ? "Deposits" : "Withdrawal"] += curr;
      return sum;
    },
    { deposits: 0, withdrawal: 0 }
  );

console.log(sums);

//String convert to titlecase

// this is a nice title --> This Is a Nice Title

const convertTitleCase = function (title) {
  const exceptions = ["a", "an", "the", "and", "but", "with", "or", "on", "in"];

  const titlecase = title
    .toLowerCase()
    .split(" ")
    .map((word) =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");
  return titlecase;
};
console.log(convertTitleCase("this is a nice title"));
