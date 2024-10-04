document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#sub').onclick = event => {
        event.preventDefault();

        if (document.querySelector('#password').type !== 'password') {
            document.querySelector('#password').type = 'password';
            document.querySelector('#invisible').style.display = 'block';
            document.querySelector('#visible').style.display = 'none';
        }

        const email = document.querySelector('input[type="email"]').value.trim();
        const password = document.querySelector('input[type="password"]').value.trim();

        if (email === '' || password === '') {
            document.querySelector('#msg').innerHTML = 'Please enter all the credentials';
        }
        else {

            const data = {
                "email": email,
                "password": password
            };

            async function login(data) {
                try {
                    const response = await fetch(`http://localhost/Minor%20Project/Code/backend/controller/LoginController.php`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        const jsonResponse = await response.json(); 
                        localStorage.setItem('userData', JSON.stringify(jsonResponse));
                        window.location.href = "../Budget/budget.html";

                    }
                    else if (response.status === 404) {
                        alert("Invalid email or password!");
                    }
                    else {
                        alert("Email not registered! Please sign-up");
                    }
                }
                catch (error) {
                    console.error(error);
                    alert("An error occured");
                }
            }

            login(data);
        }
    };

    document.querySelector('input[type="password"]').onkeyup = event => {
        event.preventDefault();
        const password = document.querySelector('input[type="password"]').value.trim();

        if (password.length === 0) {
            document.querySelector('#msg').innerHTML = 'Enter a valid password';
        } else {
            document.querySelector('#msg').innerHTML = '';
        }
    };

    document.querySelectorAll('.bi').forEach(icon => {
        icon.onclick = event => {
            event.preventDefault();

            if (document.querySelector('#password').type === 'password') {
                document.querySelector('#password').type = 'text';
                document.querySelector('#invisible').style.display = 'none';
                document.querySelector('#visible').style.display = 'block';
            } else {
                document.querySelector('#password').type = 'password';
                document.querySelector('#invisible').style.display = 'block';
                document.querySelector('#visible').style.display = 'none';
            }
        };

    });
});