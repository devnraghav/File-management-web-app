// send token on every request that's made from the dashboard
import popup from "./popup.js";
window.addEventListener('DOMContentLoaded', (e) => {
    const auth_section = document.querySelector('#auth-section');
    const dashboard_section = document.querySelector('#dashboard-section');
    const btn_logout = document.querySelector('#logout');

    // logout
    btn_logout.addEventListener('click', async (e) => {
        e.preventDefault();

        let confirmation = await popup('Confirm logout?', 'Logout');

        console.log(await confirmation);

        const token = localStorage.getItem('file_management_app');
        // logout_user(token);
    });


    function logout_user(token) {
        fetch('http://127.0.0.1:8000/dashboard/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            if (res.status == 401) {
                // clear clientside token and return to auth page
                localStorage.setItem('file_management_app', '');
                auth_section.style.display = 'flex';
                dashboard_section.style.display = 'none';
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            if (data.logout) {
                // this means logout was successful.
                // clear clientside token and return to auth page
                localStorage.setItem('file_management_app', '');
                auth_section.style.display = 'flex';
                dashboard_section.style.display = 'none';
            }
        })
        .catch(err => console.log(err));
    }
});
