const view = document.querySelectorAll('.view');
const view_btn = document.querySelectorAll('.view-btn');

view_btn.forEach((button, btn_index) => {
    button.addEventListener('click', () => {
        // only show the view for the clicked button
        view[btn_index].classList.remove('hide-view');

        // hide all the other views
        view.forEach((view, view_index) => {
            if (view_index !== btn_index) {
                view.classList.add('hide-view');
            }
        });
    });
});