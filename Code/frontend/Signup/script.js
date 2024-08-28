function validPassword(password) {
    const lower = /[a-z]/.test(password);
    const upper = /[A-Z]/.test(password);
    const num = /\d/.test(password);
    const symb = /[!@#$%^&*()+./\\?<>~`|\\-_'":;]/.test(password);
    const minl = password.length >= 8;
    return lower && upper && num && symb && minl;
}

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
        } else if (!validPassword(password)) {
            document.querySelector('#msg').innerHTML = 'Invalid Password';
            document.querySelector('#msg').style.color = 'red'
        } else {
            document.querySelector('#msg').innerHTML = 'Successful'
            document.querySelector('#msg').style.color = 'springgreen'
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