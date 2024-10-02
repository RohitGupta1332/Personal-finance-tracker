const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
const userData = JSON.parse(localStorage.getItem('userData'));

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

//dropdown
const dropDowns = document.querySelectorAll('.chevron-icon');
dropDowns.forEach((dropDown) => {
    dropDown.addEventListener('click', () => {
        const categoryRow = dropDown.closest('tr.category-type');
        // Get the next sibling rows (subcategories) until another .category-type is found
        let nextRow = categoryRow.nextElementSibling;
        while (nextRow && !nextRow.classList.contains('category-type')) {
            // Toggle the display of subcategory rows
            nextRow.style.display = nextRow.style.display === "block" ? "none" : "block";
            nextRow = nextRow.nextElementSibling;
        }
    });
});

// budget feature
document.addEventListener('DOMContentLoaded', () => {
    // Fetch budget data when the date changes
    date.addEventListener('change', (event) => {
        const newDate = event.target.value;
        const newYear = newDate.substring(0, 4);
        const newMonthIndex = parseInt(newDate.substring(5, 7), 10) - 1;
        const newMonth = monthNames[newMonthIndex];
        document.querySelector('.date').textContent = `${newMonth} ${newYear}`;
        fetchBudget(newDate);
    });


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
            const row = saveButton.closest('tr'); // Get the closest row
            // Find the closest form to the saveButton
            const form = saveButton.closest('form');

            // Find the corresponding 'tr.category-type' for that form
            const categoryRow = form.closest('tr.category-type');

            // Get the category type from the second <td> of the 'category-type' row
            let categoryType = categoryRow.querySelector('td:nth-child(2)').textContent.trim();

            /*let categoryType = document.querySelector("tbody");*/
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

    // Function to recalculate totals for each category type
    function updateCategoryTotals() {
        // Iterate over each category type (bills, needs, wants)
        document.querySelectorAll('.category-type').forEach(categoryRow => {
            // Get the tbody corresponding to the category type
            const tbody = categoryRow.closest('tbody');

            let totalAssigned = 0;
            let totalActivity = 0;
            let totalAvailable = 0;

            // Iterate over each row within the category (ignore the category-type row itself)
            tbody.querySelectorAll('tr:not(.category-type)').forEach(row => {
                // Extract values from the respective cells
                const assignedValue = parseFloat(row.querySelector('td:nth-child(3)').textContent.replace(/[₹,]/g, '')) || 0;
                const activityValue = parseFloat(row.querySelector('td:nth-child(4)').textContent.replace(/[₹,]/g, '')) || 0;
                const availableValue = parseFloat(row.querySelector('td:nth-child(5)').textContent.replace(/[₹,]/g, '')) || 0;

                // Add to the totals
                totalAssigned += assignedValue;
                totalActivity += activityValue;
                totalAvailable += availableValue;
            });

            // Update the category-type row with the new totals
            categoryRow.querySelector('.total-assigned').textContent = `₹${totalAssigned}`;
            categoryRow.querySelector('.total-activity').textContent = `₹${totalActivity}`;
            categoryRow.querySelector('.total-available').textContent = `₹${totalAvailable}`;
        });
    }
    //fetching all budget through api
    /*let categoryId;
    let assignedValue;*/

    async function fetchBudget(date) {
        try {
            const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/BudgetController.php?date=${date}, `, {
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
                    tbody.querySelectorAll('tr:not(.category-type)').forEach(tr => tr.remove()); // Clear all non-category-type rows
                });

                result.forEach(res => {
                    let budgetRow = document.createElement('tr');
                    budgetRow.setAttribute('data-category-id', res.id); // Store category ID in row

                    // Create the cells for the row
                    let deleteBtn = document.createElement('td');
                    let deleteIcon = document.createElement('i');
                    deleteIcon.classList.add('bx', 'bx-trash', 'delete-btn');
                    deleteIcon.setAttribute('budget-id', res.category_id);
                    deleteBtn.appendChild(deleteIcon);

                    let categoryNameCell = document.createElement('td');
                    categoryNameCell.textContent = res.category_name;

                    // Create a progress bar cell
                    let progressBarCell = document.createElement('td');
                    let progressBarWrapper = document.createElement('div');
                    progressBarWrapper.classList.add('progress-wrapper');
                    progressBarWrapper.style.width = '100px'; // Fixed width for the progress bar
                    progressBarWrapper.style.height = '10px';
                    progressBarWrapper.style.border = '1px solid #ccc';
                    progressBarWrapper.style.borderRadius = '5px';
                    progressBarWrapper.style.overflow = 'hidden';

                    let progressBar = document.createElement('div');
                    progressBar.classList.add('progress-bar');
                    progressBar.style.height = '100%';
                    progressBar.style.width = '100%'; // 100% for now, adjust color below

                    // Append the progress bar inside the wrapper
                    progressBarWrapper.appendChild(progressBar);
                    progressBarCell.appendChild(progressBarWrapper);

                    let assignedCell = document.createElement('td');
                    let assignedInput = document.createElement('input'); // Create input for assigned
                    assignedInput.type = 'number';
                    assignedInput.value = res.assigned == null ? 0 : res.assigned; // Default to 0 if null
                    assignedCell.appendChild(assignedInput); // Append input to assignedCell

                    let activityCell = document.createElement('td');
                    activityCell.textContent = res.activity == null ? "₹0" : `₹${res.activity}`;

                    let availableCell = document.createElement('td');
                    availableCell.textContent = res.available == null ? "₹0" : `₹${res.available}`;

                    // Change colors based on available value
                    let availableValue = parseFloat(res.available);

                    if (availableValue > 0) {
                        progressBar.style.backgroundColor = 'green';
                        availableCell.style.color = 'green';
                    } else if (availableValue === 0) {
                        progressBar.style.backgroundColor = 'yellow';
                        availableCell.style.color = 'yellow';
                    } else {
                        progressBar.style.backgroundColor = 'red';
                        availableCell.style.color = 'red';
                    }

                    // Append the cells to the row
                    budgetRow.append(deleteBtn, categoryNameCell, progressBarCell, assignedCell, activityCell, availableCell);

                    // Append the row to the appropriate tbody based on category_type
                    const categoryType = res.category_type.toLowerCase(); // Ensure it is lowercase
                    const tbody = document.querySelector(`.category-section tbody.${categoryType}`);

                    if (tbody) {
                        tbody.appendChild(budgetRow); // Append the row to the corresponding tbody
                    }
                });
                // Update the totals after adding new rows
                updateCategoryTotals();
            } else {
                console.error('HTTP error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
    // Fetch budget data with specified user ID and date
    fetchBudget(date);
    //insert budget
    async function submitBudget() {
        let details = {
            'user_id': userData.data.user_id,
            "created_date": date,
            "category_id": categoryId,
            "assigned": assignedValue,
        };

        try {
            const response = await fetch('http://localhost/Minor%20Project/Code/backend/controller/BudgetController.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userData.jwt,
                },
                body: JSON.stringify(details)
            });

            if (response.ok) {
                alert("Budget added successfully!");
                window.location.reload();
            } else {
                console.error('HTTP error:', response.status, response.statusText);
                alert("Failed to add budget.");
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert("An error occurred while adding the budget.");
        }
    }
    submitBudget();
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
                            alert("Budget deleted successfully!");
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
            }
            deleteBudget(budgetId);
        });
    });
});