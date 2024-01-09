/* eslint-disable import/extensions */
import { toast } from './toast.js';

// Get Elements
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalCloseButton = document.getElementById('modal-close-button');
const modalImageContainer = document.getElementById('modal-image-container');
const deleteButton = document.getElementById('photo-delete');
const rotateLeftButton = document.getElementById('photo-rotate-left');
const rotateRightButton = document.getElementById('photo-rotate-right');
const actionRow = document.getElementById('action-row');
const deleteConfirmRow = document.getElementById('delete-confirm-row');
const deleteCancelButton = document.getElementById('delete-cancel');
const deleteConfirmButton = document.getElementById('delete-confirm');

let currentItemId;

function rotateLeft() {}
function rotateRight() {}

function showDelete() {
  actionRow.classList.add('hidden');
  deleteConfirmRow.classList.remove('hidden');
}

function hideDelete() {
  actionRow.classList.remove('hidden');
  deleteConfirmRow.classList.add('hidden');
}

function toggleModal() {
  modal.classList.toggle('hidden');
  modal.classList.toggle('fixed');
  document.body.classList.toggle('overflow-hidden');
}

function modalOpen(imageSrc, itemId) {
  toggleModal();
  modalImage.setAttribute('class', 'm-auto');
  modalImage.src = imageSrc;
  currentItemId = itemId;

  const containerHeight = modalImageContainer.offsetHeight;
  const containerWidth = modalImageContainer.offsetWidth;

  const originalImage = document.getElementById(itemId).children[0];
  let imageHeight = originalImage.offsetHeight;
  let imageWidth = originalImage.offsetWidth;

  const min = Math.min(containerHeight, containerWidth);
  let scaleDown;
  if (imageWidth > imageHeight) {
    // landscape
    scaleDown = min / imageWidth;
  } else {
    // portrait
    scaleDown = min / imageHeight;
  }

  imageWidth = Math.round(imageWidth * scaleDown);
  imageHeight = Math.round(imageHeight * scaleDown);

  modalImage.classList.add(`max-w-[${imageWidth}px]`);
  modalImage.classList.add(`max-h-[${imageHeight}px]`);
}

window.onclick = function (event) {
  if (event.target === modal) {
    toggleModal();
  }
};
async function deletePhoto() {
  try {
    if (!currentItemId) {
      return;
    }
    const url = `/api/v1/photos/${currentItemId}`;

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
    const deletedGalleryItem = document.getElementById(currentItemId);
    deletedGalleryItem.remove();
    hideDelete();
    toggleModal();
  } catch (err) {
    toast('error occurred please try again later', 'error');
  }
}
// Event listeners
modalCloseButton.addEventListener('click', () => toggleModal(), false);
rotateLeftButton.addEventListener('click', () => rotateLeft(), false);
rotateRightButton.addEventListener('click', () => rotateRight(), false);
deleteButton.addEventListener('click', () => showDelete(), false);
deleteCancelButton.addEventListener('click', () => hideDelete(), false);
deleteConfirmButton.addEventListener('click', () => deletePhoto(), false);

document.addEventListener('keydown', (e) => {
  if (e.type === 'keydown' && e.key === 'Escape') {
    e.preventDefault();
    modal.classList.add('hidden');
    modal.classList.remove('fixed');
    document.body.classList.remove('overflow-hidden');
  }
});

export { modalOpen };
