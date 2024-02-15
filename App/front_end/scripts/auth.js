window.addEventListener('DOMContentLoaded', () => {

    // define all the fields
    const auth_section = document.querySelector('#auth-section');
    const dashboard_section = document.querySelector('#dashboard-section')
    const error_container = document.querySelector('#error-container');
    const error_message = document.querySelector('#error-message');
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

    const password_min_length = 6;

    // defining the auth type. By default login.
    let auth_type = 'login';
    // update the form
    updateAuthForm(auth_type);

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
            // auth_form_title.textContent = 'Login';
            auth_submit_button.value = 'Login';
            auth_type_link.textContent = 'First time here? Register.';
        } else {
            auth_form.insertBefore(auth_confirm_password_label, auth_type_link);
            auth_form.insertBefore(auth_confirm_password, auth_type_link);
            // auth_form_title.textContent = 'Register';
            auth_submit_button.value = 'Register';
            auth_type_link.textContent = 'Already a user? Log in.';
        }
    };
    
    auth_form.addEventListener('submit', async (e) => {

        // prevent the default action
        e.preventDefault();

        // check if all the fields are filled
        if (auth_email.value === '' || (auth_password.value === '' || auth_password.value.length < password_min_length)) {
            alert('Please fill in all the fields');
            return;
        }

        if (auth_type === 'registration') {
            // check confirm password field
            if (auth_password.value !== auth_confirm_password.value) {
                alert('Passwords do not match.');
                return;
            }
        }

        data_auth = {
            email: auth_email.value,
            password: auth_password.value
        };
        
        // send the request
        
        fetch(`http://127.0.0.1:8000/${auth_type}`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_auth)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // handle any errors

            switch (data.error) {
                case 401:
                    alert('Unauthorized. Credentials incorrect or user does not exist.');
                    break;
                case 409:
                    alert('Conflict error. User with this email already exists.');
                    break;
            };

            if (data.token) {
                // store the token in local storage
                localStorage.setItem('file_management_app', data.token);
                // DONE. REDIRECT TO DASHBOARD
                auth_section.style.display = 'none';
                dashboard_section.style.display = 'flex';
            }
        })
        .catch(error => {
            console.log(error);
        });
    });
});