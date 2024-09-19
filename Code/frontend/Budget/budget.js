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



//budget 
// Function to fetch budget data from the backend
async function fetchBudgets(user_id) {
    try {
        const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/BudgetController.php?user_id=${user_id}`);
        if (response.ok) {
            const data = await response.json();
            console.log("Fetched budgets:", data);
            displayBudgets(data);
        } else {
            console.error("Error fetching budgets:", response.statusText);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Function to add new budget data to the backend
async function addBudget(budgetData) {
    try {
        const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/BudgetController.php?budgetData=${budgetData}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(budgetData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Budget added successfully:", result);
            alert(result.message);
            fetchBudgets(budgetData.user_id);  // Refresh the budget list after adding
        } else {
            console.error("Error adding budget:", response.statusText);
        }
    } catch (error) {
        console.error("Post error:", error);
    }
}

// Function to display budget data on the page
function displayBudgets(budgets) {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';  // Clear the existing content

    budgets.forEach(budget => {
        const categoryRow = `
            <div class="category-row">
                <p>${budget.category}</p>
                <p>₹${budget.total_assigned.toLocaleString()}</p>
                <p>₹${budget.total_activity.toLocaleString()}</p>
                <p class="${budget.available < 0 ? 'negative' : ''}">₹${budget.available.toLocaleString()}</p>
            </div>
        `;

        categoryList.innerHTML += categoryRow;
    });
}

// Event listener for adding a new budget entry
document.getElementById('add-budget-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const user_id = 1; // Example user ID
    const category_id = document.getElementById('category_id').value;
    const category_type = document.getElementById('category_type').value;
    const category_name = document.getElementById('category_name').value;
    const outflow = document.getElementById('outflow').value;
    const assigned = document.getElementById('assigned').value;
    const available = assigned - outflow; // Simple calculation for available

    const budgetData = {
        user_id,
        category_id,
        category_type,
        category_name,
        outflow,
        assigned,
        available
    };

    // Add budget to backend
    addBudget(budgetData);
});

// Example: Fetch budget data for a specific user on page load
document.addEventListener('DOMContentLoaded', () => {
    const user_id = 1;  // Example user ID
    fetchBudgets(user_id);
});
