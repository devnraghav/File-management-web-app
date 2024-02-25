
const upload_btn = document.querySelector('#upload-btn');
const upload_options = document.querySelector('.upload-options');
const file_input = upload_options.querySelectorAll('input');
const uploads_container = document.querySelector('.uploads-container');
const upload_wrapper = document.querySelector('.uploads-queued-wrapper');
const hide_btn = document.querySelector('#hide-uploads-wrapper');
const hide_btn_icon = hide_btn.querySelector('i');
const remove_uploads_container = document.querySelector('#remove-uploads-container');
const files_counter = document.querySelector('#files-counter'); 
let files_uploaded_counter = 0;
files_counter.textContent = files_uploaded_counter;

file_input.forEach((input, index) => {

    input.addEventListener('change', async (e) => { 

        uploads_container.style.display = 'flex';
        upload_wrapper.style.display = 'flex';
        hide_btn_icon.className = 'fa-solid fa-chevron-down';

        // show the uploads container
        if (uploads_container.style.display != 'flex') {
            uploads_container.style.display = 'flex';
            upload_wrapper.style.display = 'flex';
        }

        if (hide_btn.querySelector('i').classList.contains('fa-chevron-up')) {
            hide_btn.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
        }

        const token = localStorage.getItem('file_management_app');

        let file_list = e?.target?.files
        
        const formData = new FormData();

        for (let i = 0; i < file_list.length; i++) {
            formData.append('file', file_list[i]);
        };

        formData.forEach(file => {
            upload_file_request(token, file);
        });
    });
});

function upload_file_request(token, file) {

    files_uploaded_counter += 1;
    files_counter.textContent = files_uploaded_counter;

    const xhr = new XMLHttpRequest();

    const file_type = file.type;
    const file_name = file.name;
    const total_size = file.size;

    const upload = document.createElement('div');
    upload.classList.add('upload');

    const upload_icon = document.createElement('i');
    upload_icon.classList.add('fa-solid', 'fa-file-pdf', 'file-type-icon');

    const upload_name = document.createElement('p');
    upload_name.classList.add('name');
    upload_name.textContent = file_name;

    const upload_percent = document.createElement('p');

    upload.appendChild(upload_icon);
    upload.appendChild(upload_name);
    upload.appendChild(upload_percent);
    upload_wrapper.appendChild(upload);

    xhr.upload.addEventListener('progress', (e) => {
        const total = total_size;
        const loaded = e.loaded;
        upload_percent.textContent = String(Math.round(loaded / total * 100)) + "%";
        if (loaded == total) {
            upload_percent.innerHTML = '<i class="fa-solid fa-check upload-checkmark"></i>'
        }
    });

    try {
        xhr.open('POST', 'http://127.0.0.1:8000/dashboard/upload', true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(file);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.response);
                console.log(response.message);
            }
        }
    }
    catch (e) {
        console.log(e);
    }

    remove_uploads_container.addEventListener('click', () => {
        upload.remove();
        uploads_container.style.display = 'none';
        files_uploaded_counter = 0;
        files_counter.textContent = files_uploaded_counter;
    });
}

hide_btn.addEventListener('click', () => {

    if (upload_wrapper.style.display == 'flex') {
        upload_wrapper.style.display = 'none';
        hide_btn_icon.className = 'fa-solid fa-chevron-up'; 
    } else {
        upload_wrapper.style.display = 'flex';
        hide_btn_icon.className = 'fa-solid fa-chevron-down'; 
    }
});

upload_btn.addEventListener('mouseover', () => {

});
upload_options.addEventListener('mouseout', () => {

});