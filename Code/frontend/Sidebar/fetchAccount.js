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

                // Update local storage with the current month's total
                updateLocalStorageWithCurrentMonth(totalAmount);

                // Create or update the bar chart with data from local storage
                const netWorthTracker = getNetWorthDataFromLocalStorage();
                createBarChart(netWorthTracker);

            } else {
                console.error('HTTP error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    function updateLocalStorageWithCurrentMonth(TotalAmount) {
        const now = new Date();
        const currentMonth = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;

        // Get existing data from local storage
        let netWorthTracker = JSON.parse(localStorage.getItem('netWorthTracker')) || {};

        // Update the tracker with the current month's total amount
        netWorthTracker[currentMonth] = TotalAmount;

        // Keep only the last 5 months of data
        const months = Object.keys(netWorthTracker);
        if (months.length > 5) {
            const monthsToKeep = months.slice(-5);
            netWorthTracker = monthsToKeep.reduce((acc, month) => {
                acc[month] = netWorthTracker[month];
                return acc;
            }, {});
        }

        // Save the updated tracker back to local storage
        localStorage.setItem('netWorthTracker', JSON.stringify(netWorthTracker));
    }

    function getNetWorthDataFromLocalStorage() {
        return JSON.parse(localStorage.getItem('netWorthTracker')) || {};
    }

    function createBarChart(netWorthTracker) {
        const canvasElement = document.getElementById('canvas');
        
        if (canvasElement) {
            const months = Object.keys(netWorthTracker);
            const netWorthValues = Object.values(netWorthTracker);

            const ctx = canvasElement.getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Net Worth',
                        data: netWorthValues,
                        backgroundColor: "#190582"
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    fetchAccount();
});
