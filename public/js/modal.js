/* eslint-disable import/extensions */
import { toast } from './toast.js';
import { ModalImage } from './ModalImage.js';
// Get Elements
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalCloseButton = document.getElementById('modal-close-button');
const modalImageContainer = document.getElementById('modal-image-container');
const rotateLeftButton = document.getElementById('photo-rotate-left');
const rotateRightButton = document.getElementById('photo-rotate-right');
const actionRow = document.getElementById('action-row');

const deleteButton = document.getElementById('photo-delete');
const deleteConfirmRow = document.getElementById('delete-confirm-row');
const deleteCancelButton = document.getElementById('delete-cancel');
const deleteConfirmButton = document.getElementById('delete-confirm');

const saveButton = document.getElementById('photo-save');
const saveConfirmRow = document.getElementById('save-confirm-row');
const saveCancelButton = document.getElementById('save-cancel');
const saveConfirmButton = document.getElementById('save-confirm');

let currentItem;
// Clean this mess up

function showDelete() {
  actionRow.classList.add('hidden');
  deleteConfirmRow.classList.remove('hidden');
}

function hideDelete() {
  actionRow.classList.remove('hidden');
  deleteConfirmRow.classList.add('hidden');
}

function showSave() {
  actionRow.classList.add('hidden');
  saveConfirmRow.classList.remove('hidden');
}

function hideSave() {
  actionRow.classList.remove('hidden');
  saveConfirmRow.classList.add('hidden');
}
function toggleModal() {
  modal.classList.toggle('hidden');
  modal.classList.toggle('fixed');
  document.body.classList.toggle('overflow-hidden');
}

function modalOpen(imageSrc, itemId) {
  // Show actions and hide confirm
  modalImage.src = imageSrc;

  actionRow.classList.remove('hidden');
  deleteConfirmRow.classList.add('hidden');
  saveConfirmRow.classList.add('hidden');

  // Show the moddel
  toggleModal();
  modalImage.onload = () => {
    const containerWidth = modalImageContainer.offsetWidth;
    const containerHeight = modalImageContainer.offsetHeight;
    currentItem = new ModalImage(itemId, imageSrc, modalImage, containerWidth, containerHeight);
  };
}

window.onclick = function (event) {
  if (event.target === modal) {
    toggleModal();
  }
};
function savePhoto() {}
async function deletePhoto() {
  try {
    if (!currentItem.id) {
      return;
    }
    const url = `/api/v1/photos/${currentItem.id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      cors: 'same-origin',
      credentials: 'same-origin',
    });

    const data = await response.json();
    if (data.error) {
      toast(data.message, 'error');
    }

    toast('photo deleted successfully', 'success');
    const deletedGalleryItem = document.getElementById(currentItem.id);
    deletedGalleryItem.remove();
    hideDelete();
    toggleModal();
  } catch (err) {
    toast('error occurred please try again later', 'error');
  }
}
// Event listeners
modalCloseButton.addEventListener('click', () => toggleModal(), false);
rotateLeftButton.addEventListener('click', () => currentItem.rotate(-90), false);
rotateRightButton.addEventListener('click', () => currentItem.rotate(90), false);

deleteButton.addEventListener('click', () => showDelete(), false);
deleteCancelButton.addEventListener('click', () => hideDelete(), false);
deleteConfirmButton.addEventListener('click', () => deletePhoto(), false);

saveButton.addEventListener('click', () => showSave(), false);
saveCancelButton.addEventListener('click', () => hideSave(), false);
saveConfirmButton.addEventListener('click', () => savePhoto(), false);

document.addEventListener('keydown', (e) => {
  if (e.type === 'keydown' && e.key === 'Escape') {
    e.preventDefault();
    modal.classList.add('hidden');
    modal.classList.remove('fixed');
    document.body.classList.remove('overflow-hidden');
  }
});

export { modalOpen };
