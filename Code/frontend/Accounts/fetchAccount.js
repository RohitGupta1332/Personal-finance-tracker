const urlParams = new URLSearchParams(window.location.search);
const text = urlParams.get('text');//taking account name through url

let AccoutName = document.querySelector('.account-name');
AccoutName.textContent = text;

//fetching all transaction through api
async function fetchTransaction(id, ac_name) {
    try {
        const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/TransactionController.php?id=${id}&ac_name=${ac_name}`, {
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

fetchTransaction(1, text);

//add transaction feature
document.addEventListener('DOMContentLoaded', () => {
    let transactionBtn = document.querySelector('.transaction');
    let formDiv = document.querySelector('.transaction-form');
    let cancelBtn = document.querySelector('.cancel-btn');
    let saveBtn = document.querySelector('.save-btn');

    transactionBtn.addEventListener('click', () => {
        formDiv.classList.toggle('visible');
    });

    cancelBtn.addEventListener('click', () => {
        formDiv.classList.remove('visible');
    });

    //handling add transaction form and save button
    saveBtn.addEventListener('click', () => {
        let formDetails = document.querySelector('.form');

        if (
            formDetails.created_date.value.trim() === "" ||
            formDetails.payee.value.trim() === "" ||
            formDetails.categories.value.trim() === "" ||
            (formDetails.outflow.value.trim() === "" &&
                formDetails.inflow.value.trim() === "")
        ) {
            alert("Please fill all the fields");
        }
        else {
            async function submitTransaction() {
                let details = {
                    'user_id': 1,
                    "ac_name": text || "Default Account",
                    "created_date": formDetails.created_date.value,
                    "payee": formDetails.payee.value,
                    "category": formDetails.categories.value,
                    "outflow": formDetails.outflow.value || null,
                    "inflow": formDetails.inflow.value || null,
                    "cleared": formDetails.cleared.checked ? 1 : 0
                };
            
                console.log("Sending data:", details);
            
                try {
                    const response = await fetch('http://localhost/Minor%20Project/Code/backend/controller/TransactionController.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(details)
                    });
            
                    if (response.ok) {
                        const result = await response.json();
                        console.log(result);
                        alert("Transaction added successfully!");
                    } else {
                        console.error('HTTP error:', response.status, response.statusText);
                        alert("Failed to add transaction.");
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                    alert("An error occurred while adding the transaction.");
                }
            }
            

            submitTransaction();
        }


    });
});

