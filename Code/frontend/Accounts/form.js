document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.add-account-btn').addEventListener('click', () => {
        let addAccountForm = document.querySelector('.add-account-form');
        addAccountForm.classList.toggle('add-account-form-visible');
    });
    
    document.querySelector('.account-cancel-btn').addEventListener('click', (event) => {
        event.preventDefault();
        let addAccountForm = document.querySelector('.add-account-form');
        addAccountForm.classList.remove('add-account-form-visible');
    });
    
    // Save the account details
    document.querySelector('.account-save-btn').addEventListener('click', (event) => {
        event.preventDefault();
        let formDetails = document.querySelector('.add-account-form');
        if (formDetails.account_name.value.trim() === "" ||
            formDetails.account_type.value.trim() === "" ||
            formDetails.balance.value.trim() === "") {
            alert("Please fill all the fields");
        } else {
            try {
                let account_name = formDetails.account_name.value.trim();
                let account_type = formDetails.account_type.value.trim();
                let balance = parseFloat(formDetails.balance.value.trim());
                let details = {
                    "user_id": 1,
                    "ac_name": account_name,
                    "ac_type": account_type,
                    "ac_balance": balance
                };
                console.log(details);
                async function addAccounts(details) {
                    const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/AccountsController.php`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(details) // Fixed typo here
                    });
    
                    if (response.ok) {
                        alert("Account added successfully!");
                        window.location.reload();
                    } else {
                        console.error('HTTP error:', response.status, response.statusText);
                        alert("Failed to add account.");
                    }
                }
    
                addAccounts(details); // Call the async function
            } catch (error) {
                console.error('Fetch error:', error);
                alert("An error occurred while adding the account.");
            }
        }
    });
    
})