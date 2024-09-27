//calender
const date = document.querySelector('.date');
const currentDate = new Date();
const year = currentDate.getFullYear();
const monthIndex = currentDate.getMonth();
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const month = monthNames[monthIndex];
date.value = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
document.querySelector('.date').textContent = `${month} ${year}`;

// Fetch budget data when the date changes
date.addEventListener('change', (event) => {
    const newDate = event.target.value;
    const newYear = newDate.substring(0, 4);
    const newMonthIndex = parseInt(newDate.substring(5, 7), 10) - 1;
    const newMonth = monthNames[newMonthIndex];
    document.querySelector('.date').textContent = `${newMonth} ${newYear}`;
    /*fetchBudget(2, newDate);*/
});

//dropdown
const dropDowns = document.querySelectorAll('.chevron-icon');
const dropDownMenus = document.querySelectorAll('.dropdown');
dropDowns.forEach((dropDown, index) => {
    dropDown.addEventListener('click', () => {
        // Toggle the form visibility
        dropDownMenus[index].style.display = dropDownMenus[index].style.display === "grid" ? "none" : "grid";
    });
});

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
const userData = JSON.parse(localStorage.getItem('userData'));

// budget feature
document.addEventListener('DOMContentLoaded', () => {

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
                let TotalAmountDiv = document.querySelector('.total-balance');
                let TotalAmount = 0;

                /* Clear the previous list items
                balance.innerHTML = '';*/

                // Show the account and its balance individually
                accountDataArray.forEach(account => {
                    let amount = document.createElement('span');
                    amount.textContent = `₹${account.ac_balance}`;

                    TotalAmount += parseFloat(account.ac_balance);
                });

                TotalAmountDiv.textContent = `₹${TotalAmount}`;

            } else {
                console.error('HTTP error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
    fetchAccount(2);

    //fetching all budget through api
    async function fetchBudget(user_id, date) {
        try {
            const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/BudgetController.php?user_id=${user_id}&date=${date}, `, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userData.jwt,
                }
            });
            if (response.ok) {
                let jsonData = await response.json();
                let result = jsonData.data;
    
                // Clear existing rows before adding new ones
                document.querySelectorAll('.category-section tbody').forEach(tbody => {
                    tbody.innerHTML = ''; // Clear all tbody sections
                });
    
                result.forEach(res => {
                    // Create a new table row
                    let budgetRow = document.createElement('tr');
                    
                    // Create the cells for the row
                    let deleteBtn = document.createElement('td');
                    let deleteIcon = document.createElement('i');
                    deleteIcon.classList.add('bx', 'bx-trash', 'delete-btn');
                    deleteIcon.setAttribute('budget-id', res.id);
                    deleteBtn.appendChild(deleteIcon);
                    
                    let categoryNameCell = document.createElement('td');
                    categoryNameCell.textContent = res.category_name;
    
                    let assignedCell = document.createElement('td');
                    assignedCell.textContent = res.assigned == null ? "₹0" : `₹${res.assigned}`;
    
                    let activityCell = document.createElement('td');
                    activityCell.textContent = res.activity == null ? "₹0" : `₹${res.activity}`;
    
                    let availableCell = document.createElement('td');
                    availableCell.textContent = res.available == null ? "₹0" : `₹${res.available}`;
    
                    // Append the cells to the row
                    budgetRow.append(deleteBtn, categoryNameCell, assignedCell, activityCell, availableCell);
    
                    // Append the row to the appropriate tbody based on category_type
                    const categoryType = res.category_type.toLowerCase(); // Ensure it is lowercase
                    const tbody = document.querySelector(`.category-section tbody.${categoryType}`);
                    
                    if (tbody) {
                        tbody.appendChild(budgetRow); // Append the row to the corresponding tbody
                    }
                });
            } else {
                console.error('HTTP error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
    
    // Fetch budget data with specified user ID and date
    fetchBudget(userId, date);

    const addButtons = document.querySelectorAll('.add');
    const categoryForms = document.querySelectorAll('.category-form');
    const saveButtons = document.querySelectorAll('.save-btn');

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
            let categoryType = document.querySelector(".category-type .category-name span").innerText;
            let categoryNameInput = categoryForms[index].querySelector(".name").value;
        
            if (categoryNameInput === "") {
                alert("Please fill all the fields");
            } else {
                async function submitCategory() {
                    let details = {
                        'user_id': userData.data.user_id,
                        "category_type": categoryType,
                        "category_name": categoryNameInput,
                    };
    
                    try {
                        const response = await fetch('http://localhost/Minor%20Project/Code/backend/controller/CategoryController.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': userData.jwt, 
                            },
                            body: JSON.stringify(details)
                        });
    
                        if (response.ok) {
                            alert("Category added successfully!");
                            window.location.reload();
                        } else {
                            console.error('HTTP error:', response.status, response.statusText);
                            alert("Failed to add Category.");
                        }
                    } catch (error) {
                        console.error('Fetch error:', error);
                        alert("An error occurred while adding the category.");
                    }
                }
                submitCategory();
            }
        });
    });
    

    //delete budget
    const categoryRows = document.querySelectorAll('.category-row');

    categoryRows.forEach((categoryRow) => {
        categoryRow.addEventListener('click', (event) => {
            // Check if the clicked element is the delete icon (trash icon)
            if (event.target && event.target.classList.contains('bx-trash')) {
                const budgetId = event.target.getAttribute('budget-id');  // Get budget ID from the clicked element

                async function deleteBudget(id) {
                    try {
                        const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/BudgetController.php?budget_id=${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': userData.jwt, 
                            }
                        });

                        if (response.ok) {
                            window.location.reload(); 
                        } else {
                            console.error('HTTP error:', response.status, response.statusText);
                            alert("Failed to delete budget.");
                        }
                    }
                    catch (error) {
                        console.error('Fetch error:', error);
                        alert("An error occurred while deleting the budget.");
                    }
                }

                deleteBudget(budgetId);  // Call the delete function with the budget ID
            }
        });
    });

});