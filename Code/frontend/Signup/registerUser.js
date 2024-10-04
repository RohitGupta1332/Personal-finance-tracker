document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#sub').onclick = event => {
        event.preventDefault();

        if (document.querySelector('#password').type !== 'password') {
            document.querySelector('#password').type = 'password';
            document.querySelector('#invisible').style.display = 'block';
            document.querySelector('#visible').style.display = 'none';
        }

        const name = document.querySelector('input[type="text"]').value.trim();
        const email = document.querySelector('input[type="email"]').value.trim();
        const password = document.querySelector('input[type="password"]').value.trim();

        if (name === '' || email === '' || password === '') {
            document.querySelector('#msg').innerHTML = 'Please enter all the credentials';
        } else {
            const data = {
                "user_name": name,
                "email": email,
                "password": password
            };

            window.location.href = `Auth.html?${data}`;

            // registerUser(data);
        }
    };

    document.querySelector('input[type="password"]').onkeyup = event => {
        event.preventDefault();
        const password = document.querySelector('input[type="password"]').value.trim();

        if (password.length === 0) {
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
