import logout_user from "./logout.js";
window.addEventListener('DOMContentLoaded', (e) => {
    const acccount_form = document.querySelector('#cred-form');
    const acccount_save_button = document.querySelector('#cred-save');
    const acccount_dicard_button = document.querySelector('#cred-discard');
    const acccount_edit_button = document.querySelector('#cred-edit');
    const token = localStorage.getItem('file_management_app');
    const account_form_fields = {};

    acccount_form.querySelectorAll('input').forEach(input => {
        account_form_fields[input.name] = input;
    });

    // setting the user info for the account preferences page
    // make a request to access user info and include the token.

    fetch('http://127.0.0.1:8000/dashboard/account_info', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (res.status == 401) {
            logout_user();
        }
        return res.json();
    })
    .then(user_info => {
        account_form_fields.display_name.value = user_info.display_name;
        account_form_fields.email.value = user_info.email;
        account_form_fields.password.value = user_info.secured_pass;
    })
    .catch(error => {
        console.log('[Account_preferences] Error getting user info:' + error);
    });

    acccount_edit_button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.target.style.display = 'none';
        acccount_save_button.style.display = 'block';
        acccount_dicard_button.style.display = 'block';
        // disabling the readonly attribute for all the fields.
        for (let input_element in account_form_fields) {
            account_form_fields[input_element].removeAttribute('readonly');
        }

        account_form_fields.original_display_name = account_form_fields.display_name.value;
        account_form_fields.original_email = account_form_fields.email.value;
        account_form_fields.original_pass = account_form_fields.password.value;
    });


    acccount_dicard_button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.target.style.display = 'none';
        acccount_save_button.style.display = 'none';
        acccount_edit_button.style.display = 'block';
        // enabling the readonly attribute for all the fields.
        for (let input_element in account_form_fields) {
            switch (input_element) {
                case 'display_name':
                    account_form_fields[input_element].value = account_form_fields.original_display_name;
                    account_form_fields[input_element].setAttribute('readonly', 'readonly');
                    break;
                case 'email':
                    account_form_fields[input_element].value = account_form_fields.original_email;
                    account_form_fields[input_element].setAttribute('readonly', 'readonly');
                    break;
                case 'password':
                    account_form_fields[input_element].value = account_form_fields.original_pass;
                    account_form_fields[input_element].setAttribute('readonly', 'readonly');
                    break;
                default:
                    // clearing the original values which were just temporary placeholder values.
                    delete account_form_fields[input_element]
                    break;
            };
        };
    });


    // save the user info
    acccount_save_button.addEventListener('click', async (e) => {
        e.preventDefault();
        // hide both discard and save buttons but show the edit button.
        e.target.style.display = 'none';
        acccount_dicard_button.style.display = 'none';
        acccount_edit_button.style.display = 'block';

        for (let input_element in account_form_fields) {
            // delete the original values which were just temporary placeholder values.
            if (input_element === 'original_pass' || input_element === 'original_email' || input_element === 'original_display_name') {
                delete account_form_fields[input_element];
            } else {
                account_form_fields[input_element].setAttribute('readonly', 'readonly');
            }
        }

        fetch('http://127.0.0.1:8000/dashboard/account_info', {

            method : 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                display_name: account_form_fields.display_name.value,
                email: account_form_fields.email.value,
                secured_pass: account_form_fields.password.value
            })
        })
        .then(res => res.json())
        .then(data => {})
        .catch(error => console.log(error));
    });
});