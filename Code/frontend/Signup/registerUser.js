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
                data.otp = user_otp.otp;
                const queryParams = new URLSearchParams(data).toString();
                window.location.href = `Auth.html?${queryParams}`;
            } else {
                console.log('OTP retrieval failed.');
            }
        }
    };

    document.querySelector('input[type="password"]').onkeyup = event => {
        event.preventDefault();
        const password = document.querySelector('input[type="password"]').value.trim();

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
            if (hasLowercase) strengthScore++;
            if (hasUppercase) strengthScore++;
            if (hasNumber) strengthScore++;
            if (hasSpecialChar) strengthScore++;
          
            // Determine the strength level based on the score
            let strengthLevel = "";
            if (strengthScore === 5) {
                strengthLevel = "Strong";
            } else if (strengthScore >= 3) {
                strengthLevel = "Medium";
            } else {
                strengthLevel = "Weak";
            }
          
            // Provide feedback to the user
            let feedback = "";
            if (strengthLevel === "Weak") {
                feedback = "Password is too weak. It should meet more criteria:<br>";
                if (!hasMinLength) feedback += "- At least 8 characters long<br>";
                if (!hasLowercase) feedback += "- Include lowercase letters<br>";
                if (!hasUppercase) feedback += "- Include uppercase letters<br>";
                if (!hasNumber) feedback += "- Include numbers<br>";
                if (!hasSpecialChar) feedback += "- Include special characters<br>";
            } else if (strengthLevel === "Medium") {
                feedback = "Password is medium strength. Consider these improvements:<br>";
                if (!hasMinLength) feedback += "- At least 8 characters long<br>";
                if (!hasLowercase) feedback += "- Include lowercase letters<br>";
                if (!hasUppercase) feedback += "- Include uppercase letters<br>";
                if (!hasNumber) feedback += "- Include numbers<br>";
                if (!hasSpecialChar) feedback += "- Include special characters<br>";
            } else {
                feedback = "Password is strong!";
            }
          
            return { strength: strengthLevel, message: feedback };
        }
        document.querySelector('#msg').innerHTML = checkPasswordStrength(password).message;
        if(checkPasswordStrength(password).strength === "Strong") {
            document.querySelector('#msg').style.color = "green";
        } else {
            document.querySelector('#msg').style.color = "red";
            document.querySelector('#sub').style.marginTop = "5px"
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
