export default function popup(message, yes_text) {
    const popup = document.querySelector('.popup');
    const popupContent = popup.querySelector('h2');
    const promptBtn = popup.querySelectorAll('.prompt-btn');
    const yesBtn = popup.querySelector('#yes-prompt');

    popup.style.display = 'flex';
    popupContent.textContent = message;
    yesBtn.textContent = yes_text;

    promptBtn.forEach((button) => {
        button.addEventListener('click', () => {
            popup.style.display = 'none';
            popupContent.textContent = '';
            yesBtn.textContent = '';
        });
    });
}
