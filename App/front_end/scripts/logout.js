

// a basic logout function
// we also need to do a clean up of the entire application before logout. -- coming soon.
export default function logout_user() {
    // this means logout was successful.
    // clear clientside token and return to auth page
    const auth_section = document.querySelector('#auth-section');
    const dashboard_section = document.querySelector('#dashboard-section');
    localStorage.setItem('file_management_app', '');
    auth_section.style.display = 'flex';
    dashboard_section.style.display = 'none';
}