/* eslint-disable import/extensions */

// Get Elements
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalCloseButton = document.getElementById('modal-close-button');

// Event listeners
modalCloseButton.addEventListener(
  'click',
  () => {
    modal.classList.add('hidden');
    modal.classList.remove('fixed');
  },
  false
);
function modalOpen(imageSrc) {
  modal.classList.add('fixed');
  modal.classList.remove('hidden');
  modalImage.src = imageSrc;
}

window.onclick = function (event) {
  if (event.target === modal) {
    modal.classList.add('hidden');
    modal.classList.remove('fixed');
  }
};

export { modalOpen };
