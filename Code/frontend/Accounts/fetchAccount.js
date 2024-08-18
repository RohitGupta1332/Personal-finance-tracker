const urlParams = new URLSearchParams(window.location.search);
const text = urlParams.get('text');

let AccoutName = document.querySelector('.account-name');
AccoutName.textContent = text;

async function fetchTransaction(id) {
    try {
        const response = await fetch(`http://127.0.0.1/Minor%20Project/Code/backend/controller/TransactionController.php?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            let jsonData = await response.json();
            let result = jsonData.data;
            console.log(jsonData);

            let tbody = document.querySelector('tbody');
            
            result.forEach(res => {
                // Create new table row
                let tableRow = document.createElement('tr');
                let deleteBtn = document.createElement('td');
                let date = document.createElement('td');
                let payee = document.createElement('td');
                let category = document.createElement('td');
                let outflow = document.createElement('td');
                let inflow = document.createElement('td');
                let cleared = document.createElement('td');

                // Creating delete button icon
                let icon = document.createElement('i');
                icon.classList.add('bx', 'bx-trash');
                deleteBtn.appendChild(icon);

                date.textContent = res.created_date;
                payee.textContent = res.payee;
                category.textContent = res.category;
                outflow.textContent = res.outflow == null ? "" : `₹${res.outflow}`;
                inflow.textContent = res.inflow == null ? "" : `₹${res.inflow}`;
                cleared.textContent = res.cleared == '1' ? "cleared" : "uncleared"; 

                tableRow.append(deleteBtn, date, payee, category, outflow, inflow, cleared);

                tbody.appendChild(tableRow);
            });
        } else {
            console.error('HTTP error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchTransaction(1)

//add transaction feature
document.addEventListener('DOMContentLoaded', () => {
    let transactionBtn = document.querySelector('.transaction');
    let form = document.querySelector('.transaction-form-hide');
    let cancelBtn = document.querySelector('.cancel-btn');

    transactionBtn.addEventListener('click', () => {
        form.classList.toggle('visible');  
    });

    cancelBtn.addEventListener('click', () => {
        form.classList.remove('visible');  
    });
});
