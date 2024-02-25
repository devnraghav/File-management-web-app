

// a basic logout function
// we also need to do a clean up of the entire application before logout. -- coming soon.

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
            if (data.logout) {
                logout_user();
            }
        })
        .catch(err => console.log(err));
    });
});

export default function logout_user() {
    // this means logout was successful.
    // clear clientside token and return to auth page
    const auth_section = document.querySelector('#auth-section');
    const dashboard_section = document.querySelector('#dashboard-section');
    localStorage.setItem('file_management_app', '');
    auth_section.style.display = 'flex';
    dashboard_section.style.display = 'none';
}