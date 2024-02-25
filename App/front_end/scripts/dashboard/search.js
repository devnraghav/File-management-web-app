const search = document.querySelector('#search');
const search_btn = document.querySelector('#search-btn');

search_btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('file_management_app');
    const search_term = search.value;

    if (search_term ==  '') {
        alert('Please enter a search term');
        return;
    }
    //todo: make a request to the server to search for the term.

});
