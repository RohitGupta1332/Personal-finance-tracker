document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.input input');
    inputs[0].focus()
    const button = document.querySelector('button');
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const data = {
        "user_name": urlParams.get('user_name'),
        "email": urlParams.get('email'),
        "password": urlParams.get('password')
    };

    const gen_otp = urlParams.get('otp');
    let otp = "";

    inputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            input.value = input.value.replace(/[^0-9]/g, '').slice(0,1);

            if (input.value !== "" && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }

            if (e.key === 'Backspace' && index > 0 && input.value === "") {
                inputs[index - 1].focus(); 
            }

            if (e.key === 'Enter') {
                button.click()
            }
        });
    });
    button.onclick = event => {
        event.preventDefault()
        const allInputsFilled = Array.from(inputs).every(input => input.value !== "");

        if(allInputsFilled) {
            otp = "";
            inputs.forEach(input => {
                otp += input.value;
            })

            async function registerUser(data) {
                try {
                    const response = await fetch('http://localhost/Minor%20Project/Code/backend/controller/RegisterController.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        window.location.href = "../Login/index.html";
                    } else if (response.status === 500) {
                        alert("This Email already exists!");
                    } else {
                        alert("Something went wrong! Please try again.");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Something went wrong! Please try again.");
                }
            }

            if(otp == gen_otp) {
                registerUser(data)
            } else {
                alert('Invalid OTP')
            }                        
        } else {
            inputs.forEach(input => {
                input.value = '';
            });
            inputs[0].focus()

            alert('Enter the OTP properly')
        }
    }
});