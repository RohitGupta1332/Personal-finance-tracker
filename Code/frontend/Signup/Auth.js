document.addEventListener('DOMContentLoaded', () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const data = {
        "user_name": urlParams.get('user_name'),
        "email": urlParams.get('email'),
        "password": urlParams.get('password')
    };
    const gen_otp = urlParams.get('otp');

    document.querySelector('#sub').onclick = event => {
        event.preventDefault();
        const otp = document.querySelector('#otp').value.trim();

        if (otp == '') {
            alert('Please enter the OTP');
        } else {
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
        }
    };
});