document.addEventListener('DOMContentLoaded', () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const data = {
        "user_name": urlParams.get(''),
        "email": email,
        "password": password
    };
    const gen_otp = urlParams.get('otp');
    

    document.querySelector('#sub').onclick = event => {
        event.preventDefault();
        const otp = document.querySelector('input[type="otp"]').value.trim();

        if (otp === '') {
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
                registerUser()
            } else {
                console.log('Not regester')
            }
        }
    };

    // document.querySelector('input[type="password"]').onkeyup = event => {
    //     event.preventDefault();
    //     const password = document.querySelector('input[type="password"]').value.trim();

    //     if (password.length === 0) {
    //         document.querySelector('#msg').innerHTML = '';
    //     }
    // };

    // document.querySelectorAll('.bi').forEach(icon => {
    //     icon.onclick = event => {
    //         event.preventDefault();
            
    //         if (document.querySelector('#password').type === 'password') {
    //             document.querySelector('#password').type = 'text';
    //             document.querySelector('#invisible').style.display = 'none';
    //             document.querySelector('#visible').style.display = 'block';
    //         } else {
    //             document.querySelector('#password').type = 'password';
    //             document.querySelector('#invisible').style.display = 'block';
    //             document.querySelector('#visible').style.display = 'none';
    //         }
    //     };
    // });
});