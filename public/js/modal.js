/* eslint-disable import/extensions */
import { toast } from './toast.js';

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

const currentItem = {
  id: '',
  rotation: 0, // 0 90 180 270
  orientation: '', // landscape portrait
  width: 0,
  height: 0,
};

const rotationClasses = {
  0: '',
  90: 'rotate-[90deg] origin-left translate-x-1/2 -translate-y-1/2',
  180: 'rotate-[180deg]',
  270: 'rotate-[270deg] origin-right -translate-x-1/2 -translate-y-1/2',
};

// Clean this mess up
function rotate(direction) {
  const classes = Array.from(modalImage.classList);
  let currentRotation = classes.filter((className) => className.includes('rotate'));
  currentRotation = currentRotation.length ? currentRotation[0] : 'rotate-[0deg]';
  const init = currentRotation.indexOf('[');
  const fin = currentRotation.indexOf('deg]');
  currentRotation = currentRotation.substr(init + 1, fin - init - 1);
  let newOrientation = Number(currentRotation) + direction;
  newOrientation %= 360;
  if (newOrientation < 0) {
    newOrientation += 360;
  }

  let newWidth;
  let newHeight;
  classes.forEach((className) => {
    if (className.includes('-w-')) {
      newHeight = className.replace('-w-', '-h-');
    }
    if (className.includes('-h-')) {
      newWidth = className.replace('-h-', '-w-');
    }
  });

  const swappedDimentions = [newWidth, newHeight, 'm-auto'];
  const newClasses = `${swappedDimentions.join(' ')} ${rotationClasses[newOrientation]}`;
  modalImage.setAttribute('class', newClasses);
}

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
  actionRow.classList.remove('hidden');
  deleteConfirmRow.classList.add('hidden');
  saveConfirmRow.classList.add('hidden');

  toggleModal();
  modalImage.setAttribute('class', 'm-auto');
  modalImage.src = imageSrc;
  currentItem.id = itemId;

  const containerHeight = modalImageContainer.offsetHeight;
  const containerWidth = modalImageContainer.offsetWidth;

  const originalImage = document.getElementById(itemId).children[0];
  let imageHeight = originalImage.offsetHeight;
  let imageWidth = originalImage.offsetWidth;

  let scaleDown;
  if (imageWidth > imageHeight) {
    scaleDown = containerWidth / imageWidth;
  } else {
    scaleDown = containerHeight / imageHeight;
  }

  imageWidth = Math.round(imageWidth * scaleDown);
  imageHeight = Math.round(imageHeight * scaleDown);

  modalImage.classList.add(`max-w-[${containerWidth}px]`);
  modalImage.classList.add(`max-h-[${containerHeight}px]`);
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
rotateLeftButton.addEventListener('click', () => rotate(-90), false);
rotateRightButton.addEventListener('click', () => rotate(90), false);

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
