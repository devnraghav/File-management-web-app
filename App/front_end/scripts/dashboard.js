window.addEventListener('DOMContentLoaded', (e) => {
    const logout = document.querySelector('#logout');


    logout.addEventListener('click', (e) => {
        e.preventDefault();
        // console.log('logout');
        logoutUser();
    });

    function logoutUser() {
        fetch('/logout', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                window.location.href = '/login';
            })
            .catch(err => console.log(err));
    }

});