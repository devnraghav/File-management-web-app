// send token on every request that's made from the dashboard
import logout_user from "./logout.js";
window.addEventListener('DOMContentLoaded', (e) => {
    const btn_logout = document.querySelector('#logout');
    // logout
    btn_logout.addEventListener('click', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('file_management_app');
        
        fetch('http://127.0.0.1:8000/dashboard/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            if (res.status == 401) {
                logout_user();
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            if (data.logout) {
                logout_user();
            }
        })
        .catch(err => console.log(err));
    });
});
