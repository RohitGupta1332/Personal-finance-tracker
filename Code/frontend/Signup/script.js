const names = document.querySelector('.credentials input[type="text"]');
const emails = document.querySelector('.credentials input[type="email"]');
const passwords = document.querySelector('.credentials input[type="password"]');
const login = document.querySelector('button');

function credentials(){
    const name = names.value;
    const email = emails.value;
    const password = passwords.value;
}

function valid_password(password) {
    const lower = /[a-z]/.test(password);
    const upper = /[A-Z]/.test(password);
    const num = /\d/.test(password);
    const symb = /[!@#$%^&*()+./\\?<>~`|\\-_'":;]/.test(password);
    const minl = password.length >= 8;
    return lower && upper && num && symb && minl;
}

login.addEventListener('click', (event) =>{
    event.preventDefault()
    if(names.value.trim() === '' || emails.value.trim() === '' || passwords.value.trim() === ''){
        alert('Please enter all the credentials!');
    } else if(!valid_password(passwords.value.trim())){
        document.getElementById('msg').textContent = 'Invalid Password';
        login.style.margin = '1.5em 0em 1rem 0em'
    } else{
        credentials();
    }
})