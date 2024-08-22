let dropDown = document.querySelector(".drop-down-heading");
let arrow = document.querySelector(".arrow");
let dropDownMenu = document.querySelector(".drop-down-list")
dropDown.addEventListener('click', () => {
    arrow.classList.toggle("arrow-rotate")
    dropDownMenu.classList.toggle("drop-down-hide")
})


//fetching Account details through api
async function fetchAccount(id) {
    try {
        let response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/AccountsController.php?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            let jsonResponse = await response.json();
            let accountDataArray = jsonResponse.data;

            let dropDownList = document.querySelector('.drop-down-list');
            let TotalAmountDiv = document.querySelector('.total-amount');
            let TotalAmount = 0;

            //showing the account and its balance individually
            accountDataArray.forEach(account => {
                let listName = document.createElement('div');
                listName.classList.add('list-name');

                let anchor = document.createElement('a');
                anchor.href = `accounts.html?text=${account.ac_name}&id=${account.ac_id}`;
                anchor.textContent = account.ac_name;
                anchor.classList.add('account');

                let amount = document.createElement('span');
                amount.textContent = `₹${account.ac_balance}`;

                listName.append(anchor);
                listName.append(amount);

                dropDownList.append(listName);

                TotalAmount += parseFloat(account.ac_balance);            
            });

            TotalAmountDiv.textContent =`₹${TotalAmount}`;
        } else {
            console.error('HTTP error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchAccount(1);
