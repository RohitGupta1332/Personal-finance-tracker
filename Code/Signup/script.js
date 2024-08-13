const names = document.querySelector('.credentials input[type="text"]');
const emails = document.querySelector('.credentials input[type="email"]');
const passwords = document.querySelector('.credentials input[type="password"]');
const login = document.querySelector('button');

function credentials(){
    const name = names.value;
    const email = emails.value;
    const password = passwords.value;
}

login.addEventListener('click', () =>{
    if(names.value.trim() === '' || emails.value.trim() === '' || passwords.value.trim() === ''){
        alert('Please enter all the credentials!');
    } else{
        credentials();
    }
})

names.addEventListener('keydown', (event) =>{
    if(event.key === 'Enter'){
        if(names.value.trim() === '' || emails.value.trim() === '' || passwords.value.trim() === ''){
            alert('Please enter all the credentials!');
        } else{
            credentials();
        }
    }
})

emails.addEventListener('keydown', (event) =>{
    if(event.key === 'Enter'){
        if(names.value.trim() === '' || emails.value.trim() === '' || passwords.value.trim() === ''){
            alert('Please enter all the credentials!');
        } else{
            credentials();
        }
    }
})

passwords.addEventListener('keydown', (event) =>{
    if(event.key === 'Enter'){
        if(names.value.trim() === '' || emails.value.trim() === '' || passwords.value.trim() === ''){
            alert('Please enter all the credentials!');
        } else{
            credentials();
        }
    }
})