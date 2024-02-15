window.addEventListener('DOMContentLoaded', () => {
    const auth_section = document.querySelector('#auth-section');
    const dashboard_section = document.querySelector('#dashboard-section');

    let token = localStorage.getItem('file_management_app');

    if (token == null) {
        localStorage.setItem('file_management_app', '');
    }

    // make a request to access the dashboard
    fetch('http://127.0.0.1:8000/dashboard', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then((res) => {
        // console.log(response);
        if (res.status == 401) {
            // clear clientside token and return to auth page
            localStorage.setItem('file_management_app', '');
            auth_section.style.display = 'flex';
            dashboard_section.style.display = 'none';
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