const userData = JSON.parse(localStorage.getItem('userData'));

async function fetchIncomeAndExpense() {
    try {
        // Fetch income and expense summary
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
            const months = resultData.map(item => formatMonth(item.month));
            const incomeData = resultData.map(item => parseFloat(item.total_income) || 0); // Set null to 0
            const expenseData = resultData.map(item => parseFloat(item.total_expense) || 0); // Set null to 0

            // Update the chart with the fetched data
            updateLineChart(months, incomeData, expenseData);
            // Update the table with the income data
            createIncomeTable(months, incomeData);
        } else {
            console.error('HTTP error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to convert 'YYYY-MM' format to 'MMM YYYY'
function formatMonth(month) {
    const date = new Date(month + '-01'); // Append day to create a valid date
    const options = { year: 'numeric', month: 'short' }; // Format options for toLocaleDateString
    return date.toLocaleDateString('en-US', options); // Convert to 'MMM YYYY'
}

// Function to create and update the income table
function createIncomeTable(months, incomeData) {
    const incomeTableContainer = document.getElementById('income-table-container');

    // Create Income Table
    let incomeTable = `
    <table>
        <thead>
            <tr>
                <th>Income Source</th>
                ${months.map(month => `<th>${month}</th>`).join('')}
                <th>Avg</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Total All Income Sources</td>
                ${incomeData.map(income => `<td>₹${income.toFixed(2)}</td>`).join('')}
                <td>₹${(incomeData.reduce((a, b) => a + b, 0) / incomeData.length).toFixed(2)}</td>
                <td>₹${incomeData.reduce((a, b) => a + b, 0).toFixed(2)}</td>
            </tr>
        </tbody>
    </table>
`;


    // Update the table container
    incomeTableContainer.innerHTML = incomeTable;
}

// Function to create the line chart
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

// Function to update the line chart with fetched data
function updateLineChart(months, incomeData, expenseData) {
    const chart = createLineChart();
    chart.data.labels = months;
    chart.data.datasets[0].data = incomeData;
    chart.data.datasets[1].data = expenseData;
    chart.update();
}

// Call the function to fetch and create the income table and update the chart
fetchIncomeAndExpense();

// Fetch transactions and display categories with month-year columns
async function fetchTransactionAndDisplay() {
    try {
        const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/TransactionController.php`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userData.jwt,
            }
        });

        if (response.ok) {
            let jsonData = await response.json();
            let transactions = jsonData.data;
            displayCategories(transactions);
        } else {
            console.error('HTTP error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Function to format date into Month and Year (e.g., Oct 2024)
function formatMonthYear(dateString) {
    const options = { year: 'numeric', month: 'short' }; // e.g., "Oct 2024"
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Function to display categories with outflow totals per month and year
function displayCategories(transactions) {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const categoryList = document.getElementById('category-list');
    const categoryTotals = {};  // Object to hold totals for each category
    const dateColumns = {};     // Object to hold unique month-year values

    // Initialize totals for each category and track unique month-year values
    if (categories && categories.data) {
        categories.data.forEach(category => {
            categoryTotals[category.category_id] = {
                name: category.category_name,
                type: category.category_type.toUpperCase(),
                totalOutflow: {},
            };
        });
    }

    // Group transactions by category and month-year
    transactions.forEach(transaction => {
        const categoryId = transaction.category_id;
        const transactionMonthYear = formatMonthYear(transaction.created_date);

        // Track unique month-year for table columns
        if (!dateColumns[transactionMonthYear]) {
            dateColumns[transactionMonthYear] = true;
        }

        if (categoryTotals[categoryId]) {
            const outflow = transaction.outflow ? parseFloat(transaction.outflow) : 0; // Set null to 0
            if (!categoryTotals[categoryId].totalOutflow[transactionMonthYear]) {
                categoryTotals[categoryId].totalOutflow[transactionMonthYear] = 0; // Initialize to 0 if undefined
            }
            categoryTotals[categoryId].totalOutflow[transactionMonthYear] += outflow;
        }
    });

    // Get all unique month-year and sort them
    const sortedMonths = Object.keys(dateColumns).sort((a, b) => new Date(a) - new Date(b));

    // Group categories by type (BILLS, NEEDS, WANTS)
    const groupedCategories = {};
    Object.values(categoryTotals).forEach(category => {
        if (!groupedCategories[category.type]) {
            groupedCategories[category.type] = [];
        }
        groupedCategories[category.type].push(category);
    });

    // Add the category rows to the table
    for (const type in groupedCategories) {
        const categories = groupedCategories[type];

        // Add a header row for the category type (BILLS, NEEDS, WANTS)
        let typeRow = document.createElement('tr');
        typeRow.innerHTML = `<td colspan="15" class="category-type">${type}</td>`;
        categoryList.appendChild(typeRow);

        // Add rows for each category under this type
        categories.forEach(category => {
            let row = document.createElement('tr');

            // First column is the category name
            let categoryCell = document.createElement('td');
            categoryCell.classList.add('category-name');
            categoryCell.textContent = category.name;
            row.appendChild(categoryCell);

            let totalOutflow = 0; // To calculate total outflow for average and total
            let monthCount = 0;   // Count of months with outflow

            // Add outflows for each month-year in this category row
            sortedMonths.forEach(monthYear => {
                let outflowCell = document.createElement('td');
                const outflow = category.totalOutflow[monthYear] || 0; // Set null to 0
                outflowCell.textContent = outflow > 0 ? `₹${outflow.toFixed(2)}` : "₹0.00"; // Display ₹0.00 for 0 outflow
                row.appendChild(outflowCell);

                // Calculate total for average
                if (outflow > 0) {
                    totalOutflow += outflow;
                    monthCount++;
                }
            });

            // Calculate average and add to the row
            const averageOutflow = monthCount > 0 ? totalOutflow / monthCount : 0;
            let averageCell = document.createElement('td');
            averageCell.textContent = monthCount > 0 ? `₹${averageOutflow.toFixed(2)}` : "₹0.00"; // Display ₹0.00 for no valid average
            row.appendChild(averageCell);

            // Add total outflow cell
            let totalCell = document.createElement('td');
            totalCell.textContent = `₹${totalOutflow.toFixed(2)}`;
            row.appendChild(totalCell);

            categoryList.appendChild(row);
        });
    }
}

fetchTransactionAndDisplay();