// setting the date on the home window
let home_date = document.querySelector('#home-top-container').querySelector('small');
let my_date = new Date().toString().split(' ').slice(0, 4).join(' ');
home_date.textContent = my_date


