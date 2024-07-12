const form = document.getElementById('form');
const loginButton = document.getElementById('login-button');

form.addEventListener('submit', async e => {
    e.preventDefault();

    if (validateInputs()) {
        try {
            const formData = new FormData();
            formData.append('username', form.username.value.trim());
            formData.append('email', form.email.value.trim());
            formData.append('password', form.password.value.trim());

            const profilePicture = document.getElementById('profile-picture').files[0];
            formData.append('profile-picture', profilePicture);

            const response = await fetch('/register', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                form.reset();
                alert('Registration successful!');
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user. Please try again later.');
        }
    }
});

loginButton.addEventListener('click', () => {
    window.location.href = '/login';  // Redirect to login page
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
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const password2 = form.password2.value.trim();
    const profilePicture = document.getElementById('profile-picture').files[0];

    let isValid = true;

    if (username === '') {
        setError(form.username, 'Username is required');
        isValid = false;
    } else {
        setSuccess(form.username);
    }

    if (email === '') {
        setError(form.email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        setError(form.email, 'Provide a valid email address');
        isValid = false;
    } else {
        setSuccess(form.email);
    }

    if (password === '') {
        setError(form.password, 'Password is required');
        isValid = false;
    } else if (password.length < 8) {
        setError(form.password, 'Password must be at least 8 characters');
        isValid = false;
    } else {
        setSuccess(form.password);
    }

    if (password2 === '') {
        setError(form.password2, 'Please confirm your password');
        isValid = false;
    } else if (password !== password2) {
        setError(form.password2, "Passwords don't match");
        isValid = false;
    } else {
        setSuccess(form.password2);
    }

    if (!profilePicture) {
        setError(document.getElementById('profile-picture'), 'Profile picture is required');
        isValid = false;
    } else {
        setSuccess(document.getElementById('profile-picture'));
    }

    return isValid;
};
