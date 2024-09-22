const userData = JSON.parse(localStorage.getItem('userData'));
document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    const addButtons = document.querySelectorAll('.add');
    const categoryForms = document.querySelectorAll('.category-form');
    const categoryRows = document.querySelectorAll('.category-row');
    const saveButtons = document.querySelectorAll('.save-btn');
    const cancelButtons = document.querySelectorAll('.cancel-btn');

    // Add new budget event
    addButtons.forEach((addButton, index) => {
        addButton.addEventListener('click', () => {
            // Toggle the form visibility
            const isVisible = categoryForms[index].style.display === "block";
            categoryForms[index].style.display = isVisible ? "none" : "block";
        });
    });

    // Save new budget event
    saveButtons.forEach((saveButton, index) => {
        saveButton.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Get values from the form
            const categoryNameInput = categoryForms[index].querySelector("#name").value;
            const assignedAmountInput = categoryForms[index].querySelector("#assigned").value;
            
            // Create a new category row dynamically
            const newRow = document.createElement('div');
            newRow.classList.add('category-row');
            newRow.innerHTML = `
                <div class="category-name">
                    <i class='bx bx-trash'></i>
                    <span>${categoryNameInput}</span>
                    <div class="progress-bar"></div>
                </div>
                <div class="category-value">
                    <span>₹${assignedAmountInput}</span>
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

            // Add delete event listener to the trash icon
            const trashIcon = newRow.querySelector('.bx-trash');
            trashIcon.addEventListener('click', () => {
                newRow.remove();
            });
        });
    });

    // Cancel button hides the form without saving
    cancelButtons.forEach((cancelButton, index) => {
        cancelButton.addEventListener('click', (event) => {
            event.preventDefault();
            categoryForms[index].style.display = "none";
        });
    });

    // Delete budget rows when clicking the trash icon
    const trashIcons = document.querySelectorAll('.bx-trash');
    trashIcons.forEach((trashIcon) => {
        trashIcon.addEventListener('click', function () {
            this.parentElement.parentElement.remove();
        });
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
