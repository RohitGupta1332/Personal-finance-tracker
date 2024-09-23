const userData = JSON.parse(localStorage.getItem('userData'));
document.addEventListener('DOMContentLoaded', function () {
    // ================= Backend API Functions =================
    // Function to insert a budget
    async function insertBudget(data) {
        try {
            const response = await fetch('http://localhost/backend/controller/BudgetController.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT Token assumed in localStorage
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
                alert('Budget inserted successfully');
                return result.data;  // Assuming the backend returns the created budget row
            } else {
                console.error(result.message);
                alert('Insert failed: ' + result.message);
            }
        } catch (error) {
            console.error('Error inserting budget:', error);
        }
    }

    // Function to get budget
    async function getBudget(date) {
        try {
            const response = await fetch(`http://localhost/backend/controller/BudgetController.php?date=${date}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result.data);
                alert('Budget fetched successfully');
                return result.data; // Handle result.data to display in the UI
            } else {
                console.error(result.message);
                alert('Failed to retrieve budget: ' + result.message);
            }
        } catch (error) {
            console.error('Error retrieving budget:', error);
        }
    }

    // Function to delete a budget
    async function deleteBudget(budget_id) {
        try {
            const response = await fetch(`http://localhost/backend/controller/BudgetController.php?budget_id=${budget_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
                alert('Budget deleted successfully');
            } else {
                console.error(result.message);
                alert('Failed to delete budget: ' + result.message);
            }
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    }

    // ================= UI Interaction Functions =================
    const addButtons = document.querySelectorAll('.add');
    const categoryForms = document.querySelectorAll('.category-form');
    const categoryRows = document.querySelectorAll('.category-row');
    const saveButtons = document.querySelectorAll('.save-btn');
    const cancelButtons = document.querySelectorAll('.cancel-btn');

    // Add new budget event - toggles form visibility
    addButtons.forEach((addButton, index) => {
        addButton.addEventListener('click', () => {
            // Toggle the form visibility
            categoryForms[index].style.display = categoryForms[index].style.display === "block" ? "none" : "block";
        });
    });

    // Save new budget event
    saveButtons.forEach((saveButton, index) => {
        saveButton.addEventListener('click', async (event) => {
            event.preventDefault();

            // Get values from the form
            const categoryNameInput = categoryForms[index].querySelector("#name").value;
            const assignedAmountInput = categoryForms[index].querySelector("#assigned").value;
            const createdDateInput = document.getElementById('createdDate').value;
            const userIdInput = document.getElementById('userId').value;

            const data = {
                user_id: userIdInput,
                created_date: createdDateInput,
                category_name: categoryNameInput,
                assigned: assignedAmountInput
            };

            // Insert the budget via the backend
            const newBudgetData = await insertBudget(data);

            if (newBudgetData) {
                // Create a new category row dynamically in the UI
                const newRow = document.createElement('div');
                newRow.classList.add('category-row');
                newRow.innerHTML = `
                    <div class="category-name">
                        <i class='bx bx-trash' data-budget-id="${newBudgetData.id}"></i>
                        <span>${categoryNameInput}</span>
                        <div class="progress-bar"></div>
                    </div>
                    <div class="category-value">
                        <span contenteditable="true">₹${assignedAmountInput}</span>
                        <span>₹0</span>
                        <span class="available">₹${assignedAmountInput}</span>
                    </div>
                `;

                // Append the new row to the category section
                categoryRows[index].parentNode.insertBefore(newRow, categoryForms[index]);

                // Clear the form inputs and hide the form
                categoryForms[index].querySelector("#name").value = '';
                categoryForms[index].querySelector("#assigned").value = '';
                categoryForms[index].style.display = "none";

                // Add delete event listener to the trash icon for the newly added row
                newRow.querySelector('.bx-trash').addEventListener('click', function () {
                    const budgetId = this.getAttribute('data-budget-id');
                    deleteBudget(budgetId);
                    newRow.remove();
                });
            }
        });
    });

    // Cancel button hides the form without saving
    cancelButtons.forEach((cancelButton, index) => {
        cancelButton.addEventListener('click', (event) => {
            event.preventDefault();
            categoryForms[index].style.display = "none";
        });
    });

    // Click handler for getting a budget
    document.getElementById('getBudgetBtn').addEventListener('click', function () {
        const date = document.getElementById('getDate').value;
        getBudget(date).then(budgetData => {
            // Handle the display of fetched budget data in the UI
            console.log(budgetData);
        });
    });

    // Click handler for deleting a budget
    document.getElementById('deleteBudgetBtn').addEventListener('click', function () {
        const budgetId = document.getElementById('deleteBudgetId').value;
        deleteBudget(budgetId);
    });

    // Edit the assigned values directly in the UI and update available amount
    document.addEventListener('input', function (event) {
        if (event.target.closest('.category-value span[contenteditable="true"]')) {
            const assignedSpan = event.target;
            const availableSpan = assignedSpan.nextElementSibling.nextElementSibling;
            const assignedValue = parseInt(assignedSpan.textContent.replace(/[^0-9]/g, ''), 10);
            availableSpan.textContent = `₹${assignedValue}`;

            // Update the progress bar based on the new available amount
            const progressBar = assignedSpan.closest('.category-row').querySelector('.progress-bar');
            const percentage = Math.min(100, Math.max(0, (assignedValue / 1000) * 100)); // Example max value
            progressBar.style.width = `${percentage}%`;
        }
    });

    // Delete budget rows when clicking the trash icon
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('bx-trash')) {
            const budgetId = event.target.getAttribute('data-budget-id');
            if (budgetId) {
                deleteBudget(budgetId);
            }
            event.target.closest('.category-row').remove();
        }
    });
});


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
