let price = 3.26;
let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]; 
const unitValue = [100, 20, 10, 5, 1, 0.25, 0.10, 0.05, 0.01];
let status;
const changeDueText = document.getElementById("change-due");
const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const productPriceText = document.getElementById("product-price");
const changeDisplay = document.getElementById("change-display");

productPriceText.textContent += price;

//function for displaying change in drawer on screen
const showCounterMoney = (arr) => {
  changeDisplay.innerHTML = `<div>Change in drawer: </div>`
  arr.forEach((item) => {
    changeDisplay.innerHTML += `<div>${item[0]}: ${item[1]}</div>`;
  })
}

showCounterMoney(cid);

//When purchase button is pressed
purchaseBtn.addEventListener("click", () => {
  clearScreen();
  showCounterMoney(cid);
  const cashPaid = parseFloat(cashInput.value);
  if (cashPaid < price) {
    alert("Customer does not have enough money to purchase the item");
    cashInput.value = "";
    return;
  } else if (cashPaid === price) {
    changeDueText.textContent = "No change due - customer paid with exact cash";
    cashInput.value = "";
    return;
  }
  checkStatus();
  showCounterMoney(cid);
  cashInput.value = "";
  console.log(changeDueText.textContent);
})

const checkStatus = () => {
  const totalMoneyInDrawer = Math.round((cid.reduce((acc, item) => acc + item[1], 0)) * 100) / 100;
  let change = Math.round((cashInput.value - price) * 100) / 100;
  if (totalMoneyInDrawer < change) {
    status = "INSUFFICIENT_FUNDS";
    updateStatusText(); 
  } else if (totalMoneyInDrawer === change) {
    status = "CLOSED";
    calculateChange();
  } else if (totalMoneyInDrawer > change) {
    calculateChange();
  }
}

 // Creating a function that returns a deep copy of an array (double-layer clone) 
const deepCopy = (arr) => {
  return JSON.parse(JSON.stringify(arr));
}

// What I've learned: Make sure numbers are rounded to 2 d.p to minimize bugs in this function//
const calculateChange = () => {
  let change = Math.round((cashInput.value - price) * 100) / 100;
  const counts = {};
  const oldCid = deepCopy(cid);
  const newCid = deepCopy(cid).reverse();
  newCid.forEach((unit, index) => {
    while (change >= unitValue[index] && unit[1] !== 0) {
      change = Math.round((change - unitValue[index]) * 100) / 100;
      counts[unit[0]] = counts[unit[0]] ? Math.round((counts[unit[0]] + unitValue[index]) * 100) / 100 : Math.round(unitValue[index] * 100) / 100;
      unit[1] = Math.round((unit[1] - unitValue[index]) * 100) / 100;
    }
  })
  if (status === "CLOSED") {
    cid = newCid.reverse();
    updateScreen(counts);
    return;
  }
  if (Math.round(change * 100) / 100 === 0) {
    status = "OPEN";
    cid = newCid.reverse();
    updateScreen(counts);
    return;
  } else {
    status = "INSUFFICIENT_FUNDS";
    updateStatusText();
    cid = oldCid;
    return;
  }
}

//function for updating change on the screen
const updateScreen = (obj) => {
  updateStatusText();
  const objKeysArr = Object.keys(obj);
  objKeysArr.forEach((key) => {
    changeDueText.innerHTML += `<div>${key}: $${obj[key]}</div>`;
    return;
  })
}

//function to clear the change due display on the screen
const clearScreen = () => {
  changeDueText.innerHTML = "";
  changeDisplay.innerHTML = "";
  return;
}

//function to update status text
const updateStatusText = () => {
  changeDueText.innerHTML += `<div>Status: ${status}</div>`;
  return;
}