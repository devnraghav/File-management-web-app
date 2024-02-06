window.addEventListener('DOMContentLoaded', () => {
    // define all the fields
    const auth_form_title = document.querySelector('#auth-form-title');
    const auth_form = document.querySelector('#auth-form');
    const auth_email = document.querySelector('#email');
    const auth_password = document.querySelector('#password');
    const auth_submit_button = document.querySelector('#auth-submit');
    const auth_type_link = document.querySelector('#login-registration-toggle-link');

    // defining our registeration confirm_password field for later reference.
    const auth_confirm_password_label = document.createElement('label');
    auth_confirm_password_label.setAttribute('for', 'confirm-password');
    auth_confirm_password_label.textContent = 'Confirm Password';

    const auth_confirm_password = document.createElement('input');
    auth_confirm_password.setAttribute('type', 'password');
    auth_confirm_password.setAttribute('name', 'confirm-password');
    auth_confirm_password.setAttribute('id', 'confirm-password');
    auth_confirm_password.setAttribute('placeholder', 'Confirm Password');

    // defining the auth type. By default login.
    let auth_type = 'login';
    // update the form
    updateAuthForm(auth_type);

    const password_min_length = 6;

    auth_type_link.addEventListener('click', (e) => {
        // prevent the default action
        e.preventDefault();

        // change the auth type
        auth_type = auth_type === 'login' ? 'registration' : 'login';

        // update the form
        updateAuthForm(auth_type);
    });


    function updateAuthForm(auth_type) {
        if (auth_type === 'login') {

            if (auth_form.contains(auth_confirm_password_label) && auth_form.contains(auth_confirm_password)) {
                auth_form.removeChild(auth_confirm_password_label);
                auth_form.removeChild(auth_confirm_password);
            }

            auth_form_title.textContent = 'Login';
            auth_submit_button.value = 'Login';
            auth_type_link.textContent = 'First time here? Register.';

        } else {

            auth_form.insertBefore(auth_confirm_password_label, auth_type_link);
            auth_form.insertBefore(auth_confirm_password, auth_type_link);

            auth_form_title.textContent = 'Register';
            auth_submit_button.value = 'Register';
            auth_type_link.textContent = 'Already a user? Log in.';
        }
    };



    auth_form.addEventListener('submit', (e) => {

        e.preventDefault();

        if (auth_email.value === '' || (auth_password.value === '' || auth_password.value.length < password_min_length)) {
            alert('Please fill in all the fields');
            return;
        }

        if (auth_type === 'login') {
            // fetch request for logging in.

            login_header = {
                'method': 'POST',
                'Content-Type': 'application/json',
                'body': JSON.stringify({
                    'email': auth_email.value,
                    'password': auth_password.value
                })
                // 'credentials': 'include'  -- in case we use cookies
            }

            fetch('http://someip:8000/login', login_header)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.log(error);
            }); 
        } 
        else if (auth_type === 'registration') {
            // check confirm password field

            if (auth_password.value !== auth_confirm_password.value) {
                alert('Passwords do not match.');
                return;
            }

            // fetch request for registeration

        }

    });

});