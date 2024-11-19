document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const currentMonth = new Date().toISOString().slice(0, 7) + '-01';

    function fetchAccounts() {
        const accountDataString = localStorage.getItem('accounts');
        const accountData = JSON.parse(accountDataString);

        if (Array.isArray(accountData)) { // Ensure it's an array
            const balances = accountData.map(account => parseFloat(account.ac_balance));
            const totalBalance = balances.reduce((sum, balance) => sum + balance, 0);

            return totalBalance;
        } else {
            console.error('Account data is not an array:', accountData);
            return null;
        }
    }

    // Function to fetch the last recorded month from the backend
    async function getLastRecordedMonth() {
        try {
            let response = await fetch('http://localhost/Minor%20Project/Code/backend/controller/NetworthController.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userData.jwt
                }
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse.last_month || null;
            } else {
                console.error('Failed to get last recorded month:', response.status, response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error getting last recorded month:', error);
            return null;
        }
    }

    // Function to add net worth to the backend
    async function addNetworth(totalNetWorth) {
        try {
            const details = {
                user_id: userData.data.user_id,
                networth_month: currentMonth,
                amount: totalNetWorth
            };
            let response = await fetch('http://localhost/Minor%20Project/Code/backend/controller/NetworthController.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userData.jwt
                },
                body: JSON.stringify(details)
            });

            if (response.ok) {
                console.log('Net worth added successfully for:', currentMonth);
            } else {
                console.error('Failed to add net worth:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error adding net worth:', error);
        }
    }


    async function getNetworth() {
        try {
            const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/NetworthController.php?date=${currentMonth}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userData.jwt
                }
            });

            if (response.status == 200) {
                const networth = await response.json();
                createBarChart(networth);

            } else {
                document.querySelector("#message").textContent = "No data found.";
            }
        } catch (error) {
            console.error('Error fetching net worth:', error);
        }
    }

    getNetworth();

    function createBarChart(netWorthTracker) {
        const canvasElement = document.getElementById('canvas');
    
        if (canvasElement) {
            // Extract the networth_records array from the tracker
            const netWorthData = netWorthTracker.networth_records.map(entry => ({
                month: entry.networth_month,
                amount: parseFloat(entry.amount)
            }));
    
            // Sort the data by month
            netWorthData.sort((a, b) => new Date(a.month) - new Date(b.month));
    
            // Prepare the chart data
            const months = netWorthData.map(item => item.month); // x-axis labels
            const netWorthValues = netWorthData.map(item => item.amount); // y-axis values
    
            // Create the chart
            const ctx = canvasElement.getContext('2d');
            new Chart(ctx, {
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
        } else {
            console.error('Canvas element not found.');
        }
    }
    
    
    

    // Main function to check and update net worth
    async function checkAndUpdateNetworth() {
        const lastRecordedMonth = await getLastRecordedMonth();
        if (lastRecordedMonth !== currentMonth) {
            const totalNetWorth = fetchAccounts();
            await addNetworth(totalNetWorth);
        } else {
            console.log('Net worth already recorded for the current month.');
        }
    }

    checkAndUpdateNetworth();
});
