//calender
const dateInput = document.getElementById('dateInput');
const currentDate = new Date();
const year = currentDate.getFullYear();
const monthIndex = currentDate.getMonth();
const monthNames = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
const month = monthNames[monthIndex];
dateInput.value = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
document.querySelector('.date').textContent = `${month} ${year}`;

//balance
let TotalAmount = 0;

accountDataArray.forEach(account => {
    TotalAmount += parseFloat(account.ac_balance);            
});

let TotalAmountDiv = document.querySelector('.total-balance');
TotalAmountDiv.textContent = `₹${TotalAmount}`;


