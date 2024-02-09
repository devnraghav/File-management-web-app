window.addEventListener('DOMContentLoaded', () => {
    // define all the fields
    // const auth_form_title = document.querySelector('#auth-form-title');
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

    // localstorage pre-check
    if (localStorage.getItem('file_app_tokens') == null) {
        localStorage.setItem('file_app_tokens', JSON.stringify({tokens: []}));
    }

    function add_update_token(user_id, token, method) {
        container = JSON.parse(localStorage.getItem('file_app_tokens')).tokens;

        if (method == "add_token") {
            // add the token to the container
            container.push(
                {
                    user_id: user_id,
                    token: token
                }
            );
        }
        else if (method == "update_token") {
            // update the token
            for (let i = 0; i < container.length; i++) {
                if (container[i].user_id == user_id) {
                    container[i].token = token;
                    break;
                }
            }
        }
        // update the localstorage
        localStorage.setItem('file_app_tokens', JSON.stringify({tokens: container}));
    }

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
        // authenticate the user to get some validation data
        auth_data = await authenticate(e, null);
        // console.log("First call: ", auth_data);

        // if there's any errors
        if (auth_data.error) {
            switch (auth_data.error) {
                case 409:
                    error_message.textContent = 'Email already in use';
                    break;
                case 401:
                    error_message.textContent = 'Unauthorized. Double check your credentials or register for a new account.';
                    break;
                case 403: // token error
                    // received new token.
                    // we first update our localstorage with the new token using the UID that we received
                    // we locate the updated token and make a final fetch request that authenticates the user.
                
                    add_update_token(auth_data.UID, auth_data.token, 'update_token')

                    authenticate(e, auth_data.token);

                    console.log("Final call: ", await authenticate(e, auth_data.token));

                    token_container = localStorage.getItem('file_app_tokens')
                    token_container = {...token_container, [auth_data.UID]: auth_data.token}

                    console.log("SUCCESS! Redirecting to dashboard...");
                    break;
                default:
                    error_message.textContent = 'Something went wrong';
                    break;
            }

        }
        else {
            if (auth_data.message == "OK") {
                // when logged in successfully
                console.log("SUCCESS! Redirecting to dashboard...");

                // redirect to the home page...


                if (auth_data.token) {
                    // when registered in successfully AND receiving our access token
                    // add our token to local storage and update form

                    // add the new token to the localstorage
                    add_update_token(auth_data.UID, auth_data.token, 'add_token')

                    // update the form
                    auth_type = 'login';
                    updateAuthForm(auth_type);
                }
            }
        }
    });

    async function authenticate(e, token_to_send) {

        // Front end logic for authenticating a user

        // Prevent the default action - done
        // Make a fetch request according to auth_type
        // If auth_type is register, don't send a token
        // If auth_type is login, request a UID
        // Once UID is received, send the corresponding token
        // Check for UID from the response
        // First response is not going to include any token
        // Find token with the UID received if there's no 409 or 401 errors
        // Re-fetch or fetch again with corresponding token to auth.
 
        e.preventDefault();

        auth_header = {
            method: 'POST',
            headers: {
                "Authorization": token_to_send,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: auth_email.value,
                password: auth_password.value
            })
            // 'credentials': 'include'  -- in case we use cookies
        }

        try {
            const response = await fetch(auth_type === 'login' ? 'http://127.0.0.1:8000/login' : 'http://127.0.0.1:8000/register', auth_header)

            const data = await response.json()
            return data;
        }
        catch (error) {
            return error;
        }
    }
});