const emails = document.querySelector('.credentials input[type="email"]');
const passwords = document.querySelector('.credentials input[type="password"]');
const login = document.querySelector('button');

function credentials(){
    const email = emails.value;
    const password = passwords.value;
}

login.addEventListener('click', () =>{
    if(emails.value.trim() === '' || passwords.value.trim() === ''){
        alert('Please enter all the credentials!')
    } else{
        credentials()
    }
})

emails.addEventListener('keydown', (event) =>{
    if(event.key === 'Enter'){
        if(passwords.value.trim() === ''){
            alert('Please enter the password!')
        } else if(emails.value.trim() === ''){
            alert('Please enter the email')
        } else{
            credentials()
        }
    }
})

passwords.addEventListener('keydown', (event) =>{
    if(event.key === 'Enter'){
        if(emails.value.trim() === ''){
            alert('Please enter the email!')
        } else if(passwords.value.trim() === ''){
            alert('Please enter the password!')
        } else{
            credentials()
        }
    }
})