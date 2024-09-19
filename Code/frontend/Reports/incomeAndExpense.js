const userData = JSON.parse(localStorage.getItem('userData'));


async function fetchIncomeAndExpense() {
    try {
        let response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/TransactionController.php?summary=monthly`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userData.jwt,
            }
        });

        if (response.ok) {
            const result = await response.json();

            const resultData = result.data;

            // Extract the months, income, and expense data
            const months = resultData.map(item => item.month);
            const incomeData = resultData.map(item => parseFloat(item.total_income));
            const expenseData = resultData.map(item => parseFloat(item.total_expense));

            // Update the chart with the fetched data
            updateLineChart(months, incomeData, expenseData);
        } else {
            console.error('HTTP error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error(error);
    }
}

function createLineChart() {
    const ctx = document.querySelector('.line-chart').getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],  // Placeholder for months
            datasets: [
                {
                    label: 'Income',
                    data: [],  // Placeholder for income data
                    borderColor: '#12E100',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Expense',
                    data: [],  // Placeholder for expense data
                    borderColor: '#FF0000',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateLineChart(months, incomeData, expenseData) {
    const chart = createLineChart();
    chart.data.labels = months;
    chart.data.datasets[0].data = incomeData;
    chart.data.datasets[1].data = expenseData;
    chart.update();
}

fetchIncomeAndExpense();
