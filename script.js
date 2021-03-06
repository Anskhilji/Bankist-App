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

const displayMovements = function (movements, sort = false){
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a,b) => a - b): movements;
  movs.forEach(function (mov,i){
    const type = mov > 0 ? 'deposit': 'withdrawal';
    const html = `
     <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
     </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}
const calDisplayBalance = function (acc){
   acc.balance = acc.movements.reduce(function (acc,cur){
    return acc + cur;
  },0);
  labelBalance.textContent = `${acc.balance}€`;
}

const calcDisplaySummary = function (acc){
  const totalDeposit = acc.movements.filter(mov=>mov>0).reduce((accu,cur)=> accu+cur,0);
  labelSumIn.textContent = `${totalDeposit}€`;

  const totalWithdrawls = acc.movements.filter(mov=>mov<0).reduce((accu,cur) => accu+cur,0);
  labelSumOut.textContent = `${Math.abs(totalWithdrawls)}€`;

  const interest =
      acc.movements.filter(mov=>mov>0)
      .map(mov=> mov * acc.interestRate/100)
      .filter((mov,i,arr)=>{
      // console.log(arr);
        return mov >= 1;
      })
      .reduce((accu,int)=> accu+int,0);
  labelSumInterest.textContent = `${interest}€`;

}

const createUserName = function (accs){
  accs.forEach(function (acc){
    acc.userName = acc.owner.toLowerCase().split(' ').map(str => str[0]).join('');
  })
}
createUserName(accounts);
// console.log(accounts);
const updateUi = function (acc){
    //    Display movements
    displayMovements(acc.movements);

    //    Display balance
    calDisplayBalance(acc);

    //    Display summery
    calcDisplaySummary(acc);
}
//Event Handler
let currentAccount;
btnLogin.addEventListener('click',function (e){
    // prevent form to submitting
    e.preventDefault();
   currentAccount = accounts.find(acc=>acc.userName === inputLoginUsername.value);
   console.log(currentAccount);
   if (currentAccount?.pin === Number(inputLoginPin.value)){
   //    Display UI and welcome message
       labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
       inputLoginUsername.value = inputLoginPin.value = '';
       inputLoginPin.blur();
       containerApp.style.opacity = 100;
     //Update Ui
     updateUi(currentAccount);
   }
});
btnTransfer.addEventListener('click',function (e){
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(acc=>acc.userName === inputTransferTo.value);
    inputTransferAmount.value = inputTransferTo.value = '';
    if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.userName !== currentAccount.userName){
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);
        // Update Ui
        updateUi(currentAccount);
    }
});

btnLoan.addEventListener('click',function (e){
    e.preventDefault();
    const requestAmount = Number(inputLoanAmount.value);
    if (requestAmount > 0 && currentAccount.movements.some(mov=> mov >= requestAmount*0.1)){
        //Add movement
        currentAccount.movements.push(requestAmount);
    //    Update UI
        updateUi(currentAccount);
    }
    inputLoanAmount.value = '';
});

btnClose.addEventListener('click',function (e) {
    e.preventDefault();
    const userClose = inputCloseUsername.value;
    const closePin = Number(inputClosePin.value);
    if (userClose === currentAccount.userName && closePin === currentAccount.pin){
        const index = accounts.findIndex(acc=> acc.userName === currentAccount.userName);
        accounts.splice(index,1);
        containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
    // inputCloseUsername.focus();

});
let sorted = false;
btnSort.addEventListener('click', function (e){
    e.preventDefault();
    displayMovements(currentAccount.movements,!sorted);
    sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
/////////////////////////////////////////////////
//Slice Method With Array
let arr = ['a,','b','c','d','e'];
console.log(arr.slice(2));
console.log(arr.slice(2,4));
console.log(arr.slice(-2));
console.log(arr.slice(2,-2));
console.log(arr.slice());
console.log([...arr]);

//Splice
console.log(arr.splice(2,3));
console.log(arr);
arr.splice(-2)
console.log(arr);

//REVERSE
arr = ['a','b','c','d','e'];
const arr2 = ['j','i','h','g','f'];
console.log(arr2.reverse());
//CONCAT
const letters = arr.concat(arr2);
console.log(letters);
//JOIN
console.log(letters.join(' - '));
*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//forOf LOOP
// for (const movement of movements){
for (const [i,movement] of movements.entries()){
  if (movement > 0){
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  }else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);

  }
}
console.log('--------FOR EACH---------');
//forEach loop
movements.forEach(function (movement,i,a) {
  if (movement > 0){
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  }else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);

  }
});
//Maps
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
currencies.forEach(function (val,key,map){
  console.log(`${key}: ${val}`);
});
//SETS

const currenciesUnique = new Set(['USD','EUR','GDP','USD','EUR','GDP']);
console.log(currenciesUnique);

currenciesUnique.forEach(function (val,_,map){
  console.log(`${val}: ${val}`);

});*/
/*
Coding Challenge #1
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
about their dog's age, and stored the data into an array (one array for each). For
now, they are just interested in knowing whether a dog is an adult or a puppy.
    A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
old.
    Your tasks:
    Create a function 'checkDogs', which accepts 2 arrays of dog's ages
('dogsJulia' and 'dogsKate'), and does the following things:
    1. Julia found out that the owners of the first and the last two dogs actually have
cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
ages from that copied array (because it's a bad practice to mutate function
parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
�
")
4. Run the function for both test datasets
Test data:
    § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
§ Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
Hints: Use tools from all lectures in this section so far �
GOOD LUCK �*/


/*const checkDogs = function (dogsJulia,dogsKate){
    const shallowCopy = dogsJulia.slice();
    shallowCopy.splice(0,1);
    shallowCopy.splice(-2);
    const remainingDog = shallowCopy.concat(dogsKate);
    remainingDog.forEach(function (val,i){
      // const sex = val >= 3 ? 'adult' : 'puppy';
      if (val >= 3){
        console.log(`Dog number ${i+1} is an adult, and is ${val} years old`);
      }else {
        console.log(`Dog number ${i+1} is still a puppy`);
      }
    });
}
checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3]);
console.log('---------Second test data----------');
checkDogs([9, 16, 6, 8, 3],[10, 5, 6, 1, 4]);*/
//Map Method
// const euroToUSD = 1.1;
// const movementsToUSD = movements.map(function (mov){
//   return mov * euroToUSD;
// });

//Map with arrow function
/*const euroToUSD = 1.1;
const movementsToUSD = movements.map(mov => mov * euroToUSD);
console.log(movements);
console.log(movementsToUSD);

const movementsDescription = movements.map((mov,i) =>
  `Movement ${i + 1}: You deposited ${mov > 0 ? 'deposited':'withdrew'}`
);
console.log(movementsDescription);

//for of loop
const movementsToUSDFor = [];
for (const mov of movements){
  movementsToUSDFor.push(mov*euroToUSD);
}
console.log(movementsToUSDFor);*/
/*//Filter method
const deposit = movements.filter(function (mov){
  return mov > 0;
});
const withDrawls = movements.filter(mov=> mov < 0);
console.log(deposit);
console.log(withDrawls);
//Reduce method
console.log(movements);
const balance = movements.reduce(function (acc,cur,i,arr){
  console.log(`Ireration ${i}:${acc}`);
  return acc + cur;
}, 0);
console.log(balance);
// Maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, 0);
console.log(max);*/

/*
Coding Challenge #2
Let's go back to Julia and Kate's study about dogs. This time, they want to convert
dog ages to human ages and calculate the average age of the dogs in their study.
    Your tasks:
    Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
ages ('ages'), and does the following things in order:
1. Calculate the dog age in human years using the following formula: if the dog is
<= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
    humanAge = 16 + dogAge * 4
2. Exclude all dogs that are less than 18 human years old (which is the same as
keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know
from other challenges how we calculate averages �)
4. Run the function for both test datasets
Test data:
    § Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]
GOOD LUCK �*/
/*const calcAverageHumanAge = function (ages){
  const humanAge = ages.map(cur => cur <= 2? 2 * cur: 16 + cur * 4);
  console.log(humanAge);
const adultDogs = humanAge.filter(mov=> mov >= 18);
console.log(adultDogs)
const dogsAve = adultDogs.reduce((acc,cur) => acc + cur)/adultDogs.length;
 return dogsAve;
}
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1,avg2);*/
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*
const euroToUSD = 1.1;
const totalDepositUSD = movements.filter(mov=> mov>0).map(mov=> mov * euroToUSD).reduce((accu,cur)=> accu+cur,0);
console.log(totalDepositUSD);*/
/*
Coding Challenge #3
Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time
as an arrow function, and using chaining!
    Test data:
    § Data 1: [5, 2, 4, 1, 15, 8, 3]
§ Data 2: [16, 6, 10, 5, 6, 1, 4]
GOOD LUCK �*/
/*
const calcAverageHumanAge = ages => ages.map(cur => cur <= 2? 2 * cur: 16 + cur * 4)
      .filter(mov=>mov>=18)
      .reduce((acc,cur,i,arr)=>{
        return acc+cur/arr.length;
      },0);
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1,avg2);*/
//find method
// const findWithDrawls = movements.find(mov=> mov<0);
// console.log(movements);
// console.log(findWithDrawls);
// console.log(accounts);
// const userName = accounts.find(acc=> acc.owner === 'Jessica Davis');
// console.log(userName);
// //with forOf loop
// for (const x of accounts){
//     if (x.owner === 'Jessica Davis') console.log(x.owner);
// }

/*
//some() Method
console.log(movements);
//Equality
console.log(movements.includes(-130));
//Condition bases
const anyDeposit = movements.some(mov=> mov>1500);
console.log(anyDeposit);
//Every Method
console.log(movements.every(mov=> mov>0));
console.log(account4.movements.every(mov=> mov>0));*/
//flat method
/*
const arr = [[1,2,3],[4,5,6],7,8];
console.log(arr.flat());
const arrDeep = [[[1,2],3],[[4,5],6],7,8];
console.log(arrDeep.flat(2))

const totalBalance = accounts.map(acc=> acc.movements).flat().reduce((accu,cur)=> accu + cur,0);
console.log(totalBalance);
//FLatMap method
const totalBalance2 = accounts.flatMap(acc=> acc.movements)
    .reduce((accu,cur)=> accu + cur,0);
console.log(totalBalance2);*/
/*
//Sorting array
const owner = ['jonsa','zach','martha','alex'];
console.log(owner.sort());
console.log(owner);
//Numbers
console.log(movements);
console.log(movements.sort());
//return a > b, A,B (keep the order)
//return a < b, A,B (switch the order)
//Ascending
// console.log(movements.sort((a,b) => {
//     if (a > b) return 1;
//     if (a < b) return -1;
// }));
console.log(movements.sort((a,b) => a - b));
//Descending
// console.log(movements.sort((a,b) => {
//     if (a > b) return -1;
//     if (a < b) return 1;
// }));
console.log(movements.sort((a,b) => b - a));*/
/*
// creating array programmatically
const arr = [1,2,3,4,5,6,7];
console.log(new Array(1,2,3,4,5,6,7));

const x = new Array(7);
console.log(x);
// x.fill(7);
x.fill(1,2,5);
console.log(x);
arr.fill(23,3,5);
console.log(arr);

//From method
const y =  Array.from({length: 7},()=> 5);
console.log(y);
const z = Array.from({length:7},(_,i)=> i + 1);
console.log(z);

labelBalance.addEventListener('click',function (){
const movementsUI = Array.from(document.querySelectorAll('.movements__value'),(el)=> Number(el.textContent.replace('€','')));
console.log(movementsUI);
});*/

/*
* Coding Challenge #4
Julia and Kate are still studying dogs, and this time they are studying if dogs are
eating too much or too little.
Eating too much means the dog's current food portion is larger than the
recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10%
above and 10% below the recommended portion (see hint).
Your tasks:
1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
the recommended food portion and add it to the object as a new property. Do
not create a new array, simply loop over the array. Forumla:
recommendedFood = weight ** 0.75 * 28. (The result is in grams of
food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too
little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
the owners array, and so this one is a bit tricky (on purpose) �
3. Create an array containing all owners of dogs who eat too much
('ownersEatTooMuch') and an array with all owners of dogs who eat too little
('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and
Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
too little!"
5. Log to the console whether there is any dog eating exactly the amount of food
that is recommended (just true or false)
6. Log to the console whether there is any dog eating an okay amount of food
(just true or false)
7. Create an array containing the dogs that are eating an okay amount of food (try
to reuse the condition used in 6.)
8. Create a shallow copy of the 'dogs' array and sort it by recommended food
portion in an ascending order (keep in mind that the portions are inside the
array's objects �)
The Complete JavaScript Course 26
Hints:
§ Use many different tools to solve these challenges, you can use the summary
lecture to choose between them �
§ Being within a range 10% above and below the recommended portion means:
current > (recommended * 0.90) && current < (recommended *
1.10). Basically, the current portion should be between 90% and 110% of the
recommended portion.
Test data:
 const dogs = [
 { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
 { weight: 8, curFood: 200, owners: ['Matilda'] },
 { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
 { weight: 32, curFood: 340, owners: ['Michael'] },
 ];*/
const dogs = [
    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
    { weight: 8, curFood: 200, owners: ['Matilda'] },
    { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
    { weight: 32, curFood: 340, owners: ['Michael'] },
];
// 1.
dogs.forEach(cur=> {
   cur.recommendedFood = Math.trunc(cur.weight ** 0.75 * 28);
});
console.log(dogs);
// 2.
const sarahDog = dogs.find(acc=> acc.owners.includes('Sarah'));
console.log(sarahDog);
sarahDog.curFood > sarahDog.recommendedFood ? console.log(`Sarah's dog eating too much`): console.log('Sarah\'s dog eating too little');
// 3.
const ownersEatTooMuch = dogs.filter(cur=>cur.curFood > cur.recommendedFood).flatMap(cur=>cur.owners);
const ownersEatTooLittle = dogs.filter(cur=>cur.curFood < cur.recommendedFood).flatMap(cur=>cur.owners);
console.log(ownersEatTooMuch,ownersEatTooLittle);
// 4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dog eat too much`);
console.log(` ${ownersEatTooLittle.join(' and ')}'s dog eat too little!`);
// 5.
const chekFoodEqualToRecommended = dogs.some(cur=>cur.curFood === cur.recommendedFood);
console.log(chekFoodEqualToRecommended);
// 6.
// current > (recommended * 0.90) && current < (recommended * 1.10)
const checkEatingOk = cur=> cur.curFood > (cur.recommendedFood * 0.9) && cur.curFood < (cur.recommendedFood * 1.10);
console.log(dogs.some(checkEatingOk));
// 7.
console.log(dogs.filter(checkEatingOk));
// 8.
const dogsCopy = dogs.slice();
dogsCopy.sort((a,b) => a.recommendedFood - b.recommendedFood );
console.log(dogs);
console.log(dogsCopy);