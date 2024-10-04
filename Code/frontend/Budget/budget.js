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
        let nextRow = categoryRow.nextElementSibling;
        while (nextRow && !nextRow.classList.contains('category-type')) {
            nextRow.style.display = nextRow.style.display === "grid" ? "none" : "grid";
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

    addButtons.forEach((addButton, index) => {
        addButton.addEventListener('click', () => {
            categoryForms[index].style.display = categoryForms[index].style.display === "grid" ? "none" : "grid";
        });
    });
    // Save new budget 
    saveButtons.forEach((saveButton, index) => {
        saveButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const form = saveButton.closest('form');
            const categoryRow = form.closest('tr.category-type');
            let categoryType = categoryRow.querySelector('td:nth-child(2)').textContent.trim();
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
        document.querySelectorAll('.category-type').forEach(categoryRow => {
            const tbody = categoryRow.closest('tbody');
            let totalAssigned = 0;
            let totalActivity = 0;
            let totalAvailable = 0;

            tbody.querySelectorAll('tr').forEach(row => {
                if (row.classList.contains('category-type')) return;

                const assignedValue = parseFloat(row.querySelector('td:nth-child(4) input').value) || 0;
                const activityValue = parseFloat(row.querySelector('td:nth-child(5)').textContent.replace(/[₹,]/g, '')) || 0;
                const availableValue = assignedValue - activityValue;

                const availableCell = row.querySelector('td:nth-child(6)');
                availableCell.textContent = `₹${availableValue.toLocaleString()}`;

                totalAssigned += assignedValue;
                totalActivity += activityValue;
                totalAvailable += availableValue;
                // Update the "Ready to Assign" balance
                const readyToAssign = document.querySelector('.total-balance');
                const currentReadyToAssign = parseFloat(readyToAssign.textContent.replace(/[₹,]/g, '')) || 0;
                const newReadyToAssign = currentReadyToAssign - assignedValue;
                readyToAssign.textContent = `₹${newReadyToAssign.toLocaleString()}`;
            });
            // Update the totals in the category-type row
            categoryRow.querySelector('.total-assigned').textContent = `₹${totalAssigned.toLocaleString()}`;
            categoryRow.querySelector('.total-activity').textContent = `₹${totalActivity.toLocaleString()}`;
            categoryRow.querySelector('.total-available').textContent = `₹${totalAvailable.toLocaleString()}`;
        });
    }
    //fetching all budget
    async function fetchBudget(date) {
        try {
            const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/BudgetController.php?date=${date}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userData.jwt,
                }
            });
            if (response.ok) {
                let jsonData = await response.json();
                localStorage.setItem('categories', JSON.stringify(jsonData));
                let result = jsonData.data;


                document.querySelectorAll('.category-section tbody').forEach(tbody => {
                    tbody.querySelectorAll('tr:not(.category-type)').forEach(tr => tr.remove()); 
                });
                result.forEach(res => {
                    let budgetRow = document.createElement('tr');

                    let deleteBtn = document.createElement('td');
                    let deleteIcon = document.createElement('i');
                    deleteIcon.classList.add('bx', 'bx-trash', 'delete-btn');
                    deleteIcon.setAttribute('budget-id', res.category_id);
                    deleteBtn.appendChild(deleteIcon);

                    let categoryNameCell = document.createElement('td');
                    categoryNameCell.textContent = res.category_name;

                    let progressBarCell = document.createElement('td');
                    let progressBarWrapper = document.createElement('div');
                    progressBarWrapper.classList.add('progress-wrapper');
                    progressBarWrapper.style.width = '170px'; 
                    progressBarWrapper.style.height = '16px';
                    progressBarWrapper.style.borderRadius = '30px';
                    progressBarWrapper.style.overflow = 'hidden';

                    let progressBar = document.createElement('div');
                    progressBar.classList.add('progress-bar');
                    progressBar.style.height = '100%';
                    progressBar.style.width = '100%'; 

                    progressBarWrapper.appendChild(progressBar);
                    progressBarCell.appendChild(progressBarWrapper);

                    let assignedCell = document.createElement('td');
                    let assignedInput = document.createElement('input'); 
                    assignedInput.type = 'number';
                    assignedInput.classList.add('assign-budget');
                    assignedInput.setAttribute('category-id', res.category_id);
                    assignedInput.value = res.assigned == null ? 0 : res.assigned; 
                    assignedCell.appendChild(assignedInput); 
                    let activityCell = document.createElement('td');
                    activityCell.textContent = res.activity == null ? "₹0" : `₹${res.activity}`;
                    let availableValue = (res.assigned || 0) - (res.activity || 0);
                    let availableCell = document.createElement('td');
                    availableCell.textContent = `₹${availableValue.toLocaleString()}`;
                    
                    if (availableValue > 0) {
                        progressBar.style.backgroundColor = 'green';
                        availableCell.style.color = 'green';
                    } else if (availableValue === 0) {
                        progressBar.style.backgroundColor = 'darkorange';
                        availableCell.style.color = 'darkorange';
                    } else {
                        progressBar.style.backgroundColor = 'red';
                        availableCell.style.color = 'red';
                    }
                    budgetRow.append(deleteBtn, categoryNameCell, progressBarCell, assignedCell, activityCell, availableCell);
                    const categoryType = res.category_type.toLowerCase(); 
                    const tbody = document.querySelector(`.category-section tbody.${categoryType}`);
                    if (tbody) {
                        tbody.appendChild(budgetRow);
                    }
                    assignedInput.addEventListener('keydown', (event) => {
                        if (event.key === 'Enter') {
                            submitBudget(assignedInput.value, assignedInput.getAttribute('category-id'));
                        }
                    })
                });
                updateCategoryTotals();
            } else {
                console.error('HTTP error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
    fetchBudget(date.value);
    //insert budget
    async function submitBudget(assignedValue, categoryId) {
        let details = {
            'user_id': userData.data.user_id,
            "created_date": date.value,
            "category_id": categoryId,
            "assigned": assignedValue,
        };
        console.log(details)
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
    //delete category
    const tableBodies = document.querySelectorAll('.category-section tbody');

    tableBodies.forEach((tableBody) => {
    tableBody.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('bx-trash')) {
                const budgetId = event.target.getAttribute('budget-id');  
                async function deleteBudget(id) {
                    try {
                        const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/CategoryController.php?category_id=${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': userData.jwt,
                            }
                        });
                        if (response.ok) {
                            localStorage.removeItem('categories');
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
                deleteBudget(budgetId);
            }
        });
    });
});