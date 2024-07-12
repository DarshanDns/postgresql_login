const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    if (validateInputs()) {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: loginForm.email.value.trim(),
                    password: loginForm.password.value.trim()
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                alert('Login successful!');
                // window.location.href = '/dashboard'; // I should create a page for landing
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in. Please try again later.');
        }
    }
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();

    let isValid = true;

    if (email === '') {
        setError(loginForm.email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        setError(loginForm.email, 'Provide a valid email address');
        isValid = false;
    } else {
        setSuccess(loginForm.email);
    }

    if (password === '') {
        setError(loginForm.password, 'Password is required');
        isValid = false;
    } else {
        setSuccess(loginForm.password);
    }

    return isValid;
};
