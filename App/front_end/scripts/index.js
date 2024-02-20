import logout_user from "./logout.js";
window.addEventListener('DOMContentLoaded', () => {
    const auth_section = document.querySelector('#auth-section');
    const dashboard_section = document.querySelector('#dashboard-section');

    let token = localStorage.getItem('file_management_app');

    if (token == null) {
        localStorage.setItem('file_management_app', '');
    }
    // make a request to access the dashboard
    fetch('http://127.0.0.1:8000/dashboard', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then((res) => {
        // console.log(response);
        if (res.status == 401) {
            // logout
            logout_user();
        }
        else if (res.ok) {
            auth_section.style.display = 'none';
            dashboard_section.style.display = 'flex';
        }
        else {
            console.log('Something went wrong');
        }
        res.json();
    })
    .catch(error => {
        console.log(error);
    });
});