const urlParams = new URLSearchParams(window.location.search);
const text = urlParams.get('text');//taking account name through url
const accountId = urlParams.get('id');

let AccoutName = document.querySelector('.account-name');
AccoutName.textContent = text;

//add transaction feature
document.addEventListener('DOMContentLoaded', () => {
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

                let tbody = document.querySelector('tbody');

                let clearedInflow = 0;
                let unclearedInflow = 0;

                let clearedOutflow = 0;
                let unclearedOutflow = 0;

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
                    icon.classList.add('bx', 'bx-trash', 'delete-btn');
                    icon.setAttribute('transaction-id', res.id);
                    deleteBtn.appendChild(icon);

                    date.textContent = res.created_date;
                    payee.textContent = res.payee;
                    category.textContent = res.category;
                    outflow.textContent = res.outflow == null ? "" : `₹${res.outflow}`;
                    inflow.textContent = res.inflow == null ? "" : `₹${res.inflow}`;
                    cleared.textContent = res.cleared == '1' ? "cleared" : "uncleared";

                    tableRow.append(deleteBtn, date, payee, category, outflow, inflow, cleared);

                    tbody.appendChild(tableRow);

                    if(res.cleared == 1){
                        clearedInflow += res.inflow;
                        clearedOutflow += res.outflow;
                    }
                    else{
                        unclearedInflow += res.inflow;
                        unclearedOutflow += res.outflow;
                    }

                });

                let clearedBalance = clearedInflow - clearedOutflow;
                let unclearedBalance = unclearedInflow - unclearedOutflow;

                let workingCapital = clearedBalance + unclearedBalance;

                document.querySelector('.cleared-balance').textContent = clearedBalance;
                document.querySelector('.uncleared-balance').textContent = unclearedBalance;
                document.querySelector('.working-capital').textContent = workingCapital;
            } else {
                console.error('HTTP error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    fetchTransaction(1, text); //chnage the user id

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
                    "created_date": formDetails.created_date.value.trim(),
                    "payee": formDetails.payee.value.trim(),
                    "category": formDetails.categories.value.trim(),
                    "outflow": formDetails.outflow.value.trim() || null,
                    "inflow": formDetails.inflow.value.trim() || null,
                    "cleared": formDetails.cleared.checked ? 1 : 0
                };

                try {
                    const response = await fetch('http://localhost/Minor%20Project/Code/backend/controller/TransactionController.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(details)
                    });

                    if (response.ok) {
                        alert("Transaction added successfully!");
                        window.location.reload();
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

    //delete transaction
    document.querySelector('tbody').addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('delete-btn')) {
            const transactionId = event.target.getAttribute('transaction-id');
            async function deleteTransaction(id) {
                try {
                    const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/TransactionController.php?id=${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })

                    if (response.ok) {
                        alert("Transaction deleted successfully!");
                        window.location.reload(); // Reload the page after deleting the transaction
                    } else {
                        console.error('HTTP error:', response.status, response.statusText);
                        alert("Failed to delete transaction.");
                    }
                } 
                catch (error) {
                    console.error('Fetch error:', error);
                    alert("An error occurred while deleting the transaction.");
                }
            }

            deleteTransaction(transactionId);
        }
    });

    // //delete account
    document.querySelector('.delete-account').addEventListener('click', () => {
        if (accountId && confirm("Are you sure you want to delete this account?")) {
            async function deleteAllTransactions(userId, accountName) {
                try {
                    const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/TransactionController.php?id=${userId}&ac_name=${accountName}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
            
                    if (response.ok) {
                        console.log("All transactions deleted successfully!");
                        // After deleting transactions, delete the account
                        await deleteAccount(accountId);
                    } else {
                        console.error('HTTP error:', response.status, response.statusText);
                        alert("Failed to delete transactions.");
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                    alert("An error occurred while deleting transactions.");
                }
            }            

            async function deleteAccount(id) {
                try {
                    const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/AccountsController.php?id=${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
    
                    if (response.ok) {
                        alert("Account deleted successfully!");
                        window.location.reload(); // Reload the page after deleting the account
                    } else {
                        console.error('HTTP error:', response.status, response.statusText);
                        alert("Failed to delete account.");
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                    alert("An error occurred while deleting the account.");
                }
            }
    
            deleteAllTransactions(1, text);
        }
    });
    
});


