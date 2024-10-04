document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#sub').onclick = async event => {
        event.preventDefault();

        // Toggle password visibility (if necessary)
        if (document.querySelector('#password').type !== 'password') {
            document.querySelector('#password').type = 'password';
            document.querySelector('#invisible').style.display = 'block';
            document.querySelector('#visible').style.display = 'none';
        }

        // Get input values
        const name = document.querySelector('input[type="text"]').value.trim();
        const email = document.querySelector('input[type="email"]').value.trim();
        const password = document.querySelector('input[type="password"]').value.trim();

        // Check if any field is empty
        if (name === '' || email === '' || password === '') {
            document.querySelector('#msg').innerHTML = 'Please enter all the credentials';
        } else {
            const data = {
                "user_name": name,
                "email": email,
                "password": password
            };

            // Function to fetch OTP asynchronously
            async function getotp(data) {
                try {
                    const response = await fetch('http://localhost/Minor%20Project/Code/backend/Authentication/send.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        let jsonData = await response.json();
                        return jsonData;
                    }
                } catch (error) {
                    console.error(error);
                    alert("Something went wrong! Please try again.");
                    return null;
                }
            }

            // Await the OTP result
            const user_otp = await getotp(data);
            if (user_otp) {

                // Add the OTP to the data and send to the next page
                data.otp = user_otp.otp;
                const queryParams = new URLSearchParams(data).toString();
                window.location.href = `Auth.html?${queryParams}`;
            } else {
                console.log('OTP retrieval failed.');
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
