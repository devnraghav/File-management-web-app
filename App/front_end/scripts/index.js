window.addEventListener('DOMContentLoaded', () => {
    const auth_section = document.querySelector('#auth-section');
    const dashboard_section = document.querySelector('#dashboard-section');

    let token = localStorage.getItem('file_management_app');

    if (token == null) {
        localStorage.setItem('file_management_app', '');
    }

    if (token != '') {
        // make a request to access the dashboard
        fetch('http://127.0.0.1:8000/dashboard', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.valid) {
                auth_section.style.visibility = 'hidden';
                dashboard_section.style.visibility = 'visible';
            }
            else {
                auth_section.style.visibility = 'visible';
                dashboard_section.style.visibility = 'hidden';
            }
        })
        .catch(error => {
            console.log(error);
        });
    }
    else {
        console.log('No token in storage.');
        auth_section.style.visibility = 'visible';
    }
});