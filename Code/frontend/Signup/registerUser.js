document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#sub').onclick = async event => {
        event.preventDefault();

        function checkPasswordStrength(password) {
            // Define criteria for a strong password
            const hasMinLength = password.length >= 8;
            const hasLowercase = /[a-z]/.test(password);
            const hasUppercase = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
          
            // Calculate a strength score based on the criteria
            let strengthScore = 0;
            if (hasMinLength) strengthScore++;
            if (hasLowercase || hasUppercase) strengthScore++;
            if (hasNumber) strengthScore++;
            if (hasSpecialChar) strengthScore++;
          
            // Determine the strength level based on the score
            let strengthLevel = "";
            if (strengthScore === 4) {
                strengthLevel = "Strong";
            } else if (strengthScore >= 2) {
                strengthLevel = "Medium";
            } else {
                strengthLevel = "Weak";
            }

            return strengthLevel;
        }

        // Toggle password visibility (if necessary)
        if (document.querySelector('#password').type !== 'password') {
            document.querySelector('#password').type = 'password';
            document.querySelector('#invisible').style.display = 'block';
            document.querySelector('#visible').style.display = 'none';
        }

        // Get input values
        const name = document.querySelector('input[name="user_name"]').value.trim();
        const email = document.querySelector('input[type="email"]').value.trim();
        const password = document.querySelector('#password').value.trim();
        console.log(name, email, password)
        // Check if any field is empty
        if (name === '' || email === '' || password === '') {
            document.querySelector('#msg').innerHTML = 'Please enter all the credentials';
            document.querySelector('#sub').style.marginTop = "23px"
        } else if(checkPasswordStrength(password) !== "Strong") {
            alert('Enter a valid strong password!');
        } else {
            const data = {
                "email": email,
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

            async function checkEmail(data) {
                try {
                    const response = await fetch('http://localhost/Minor%20Project/Code/backend/controller/RegisterController.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        alert("Email already exists!");
                    }
                    else{
                        const user_otp = await getotp(data);
                        if (user_otp) {
                            data.otp = user_otp.otp;
                            data.user_name = name;
                            data.password = password;
                            const queryParams = new URLSearchParams(data).toString();
                            window.location.href = `Auth.html?${queryParams}`;
                        } else {
                            console.log('OTP retrieval failed.');
                        }
                    }
                } catch (error) {
                    console.error(error);
                    alert("Something went wrong! Please try again.");
                }
            }

            checkEmail(data);
        }
    };

    document.querySelector('#password').onkeyup = event => {
        event.preventDefault();
        const password = document.querySelector('#password').value.trim();

        function checkPasswordStrength(password) {
            // Define criteria for a strong password
            const hasMinLength = password.length >= 8;
            const hasLowercase = /[a-z]/.test(password);
            const hasUppercase = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
          
            // Calculate a strength score based on the criteria
            let strengthScore = 0;
            if (hasMinLength) strengthScore++;
            if (hasLowercase || hasUppercase) strengthScore++;
            if (hasNumber) strengthScore++;
            if (hasSpecialChar) strengthScore++;
          
            // Determine the strength level based on the score
            let strengthLevel = "";
            if (strengthScore === 4) {
                strengthLevel = "Strong";
            } else if (strengthScore >= 2) {
                strengthLevel = "Medium";
            } else {
                strengthLevel = "Weak";
            }
          
            // Provide feedback to the user
            let feedback = "";
            if (strengthLevel === "Weak") {
                feedback = "Password is too weak. It should meet more criteria:";
                if (!hasMinLength) feedback += " At least 8 characters long,";
                if (!hasLowercase || !hasUppercase) feedback += " Include letters,";
                if (!hasNumber) feedback += " Include numbers,";
                if (!hasSpecialChar) feedback += " Include special characters";
            } else if (strengthLevel === "Medium") {
                feedback = "Password is medium strength. Consider these improvements:";
                if (!hasMinLength) feedback += " At least 8 characters long,";
                if (!hasLowercase || !hasUppercase) feedback += " Include letters,";
                if (!hasNumber) feedback += " Include numbers,";
                if (!hasSpecialChar) feedback += " Include special characters";
            } else {
                feedback = "Password is strong!";
            }
          
            return { strength: strengthLevel, message: feedback };
        }
        document.querySelector('#msg').innerHTML = checkPasswordStrength(password).message;
        if(checkPasswordStrength(password).strength === "Strong") {
            document.querySelector('#msg').style.color = "green";
            document.querySelector('#sub').style.marginTop = "23px"
        } else {
            document.querySelector('#msg').style.color = "red";
            document.querySelector('#sub').style.marginTop = "6px"
        }
        
        if(password.length === 0) {
            document.querySelector('#msg').innerHTML = '';
            document.querySelector('#sub').style.marginTop = "40px"
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