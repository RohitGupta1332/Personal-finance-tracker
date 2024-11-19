document.addEventListener('DOMContentLoaded', () => {
    let dropDown = document.querySelector(".drop-down-heading");
    let arrow = document.querySelector(".arrow");
    let dropDownMenu = document.querySelector(".drop-down-list");

    if (dropDown && arrow && dropDownMenu) {
        dropDown.addEventListener('click', () => {
            arrow.classList.toggle("arrow-rotate");
            dropDownMenu.classList.toggle("drop-down-hide");
        });
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    document.querySelector('.user-email').textContent = userData.data.email;
    document.querySelector('.user-name').textContent = userData.data.user_name;

    async function fetchAccount() {
        try {
            let response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/AccountsController.php`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userData.jwt,
                }
            });

            if (response.ok) {
                let jsonResponse = await response.json();
                let accountDataArray = jsonResponse.data;

                localStorage.setItem('accounts', JSON.stringify(accountDataArray));

                let dropDownList = document.querySelector('.drop-down-list');
                let totalAmountDiv = document.querySelector('.total-amount');
                let totalbalance = document.querySelector('.total-balance');

                let totalAmount = 0;

                // Clear the previous list items
                if (dropDownList) {
                    dropDownList.innerHTML = '';

                    // Show the account and its balance individually
                    accountDataArray.forEach(account => {
                        let listName = document.createElement('div');
                        listName.classList.add('list-name');

                        let anchor = document.createElement('a');
                        anchor.href = `../Accounts/accounts.html?text=${account.ac_name}&id=${account.ac_id}`;
                        anchor.textContent = account.ac_name;
                        anchor.classList.add('account');

                        let amount = document.createElement('span');
                        amount.textContent = `₹${account.ac_balance}`;

                        listName.append(anchor);
                        listName.append(amount);

                        dropDownList.append(listName);

                        totalAmount += parseFloat(account.ac_balance);
                    });
                }

                // Update the total amounts only if the element exists
                if (totalbalance) {
                    totalbalance.textContent = `₹${totalAmount}`;
                }
                totalAmountDiv.textContent = `₹${totalAmount}`;

            } else {
                console.error('HTTP error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }


    fetchAccount();

    //logout
    document.querySelector('#log-out').addEventListener('click', () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('accounts');
        localStorage.removeItem('categories');
        window.location.href = '../Login/index.html';
    });
});
