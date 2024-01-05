// ************************ Drag and drop ***************** //
// eslint-disable-next-line no-unused-vars
function toast(message, type) {
  const toastParent = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  toastText.innerText = message;
  toastParent.classList.remove('opacity-0');
  toastParent.classList.add('opacity-100');
  if (type === 'error') {
    toastParent.classList.remove('bg-mint');
    toastParent.classList.add('bg-red');
  }
  if (type === 'success') {
    toastParent.classList.remove('bg-red');
    toastParent.classList.add('bg-mint');
  }

  setTimeout(() => {
    toastParent.classList.remove('opacity-100');
    toastParent.classList.add('opacity-0');
  }, '3000');
}

function returnFileSize(number) {
  if (number < 1024) {
    return `${number} bytes`;
  }
  if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`;
  }
  if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`;
  }
  return '';
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

const submitButton = document.getElementById('submit');
const dropArea = document.getElementById('drop-area');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach((eventName) => {
  dropArea.addEventListener(eventName, () => dropArea.classList.add('bg-teal', 'bg-opacity-20'), false);
});
['dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, () => dropArea.classList.remove('bg-teal', 'bg-opacity-20'), false);
});

let pendingFiles = [];

const deleteFile = (filename) => {
  const file = document.getElementById(filename);
  file.remove();
  pendingFiles = pendingFiles.filter((f) => f.name !== filename);
  if (pendingFiles && pendingFiles.length === 0) {
    submitButton.classList.remove('block');
    submitButton.classList.add('hidden');
  }
};

function previewFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    const container = document.createElement('div');
    container.classList.add('w-full', 'md:w-1/3', 'p-2');
    container.id = file.name;
    const inner = document.createElement('div');
    inner.classList.add('bg-teal', 'bg-opacity-20', 'p-4', 'flex', 'md:block', 'justify-between', 'items-center');

    const preview = document.createElement('img');
    preview.classList.add('w-1/3', 'md:w-full');
    preview.src = reader.result;
    inner.appendChild(preview);

    const info = document.createElement('div');
    info.classList.add('text-sm');
    const name = document.createElement('div');
    name.innerText = file.name;
    const size = document.createElement('div');
    size.innerText = returnFileSize(file.size);
    info.appendChild(name);
    info.appendChild(size);
    inner.appendChild(info);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('ml:auto', 'md:w-full');

    const button = document.createElement('button');
    button.classList.add('hover:bg-red', 'p-2', 'rounded-full', 'transition-colors');

    const trash = document.createElement('img');
    trash.src = 'icons/trash.svg';
    trash.classList.add('w-6', 'h-6', 'max-w-none');
    button.append(trash);
    button.addEventListener('click', () => deleteFile(file.name));
    buttonContainer.appendChild(button);

    inner.appendChild(buttonContainer);
    container.appendChild(inner);

    document.getElementById('gallery').appendChild(container);
  };
}

function handleFiles(files) {
  [...files].forEach((file) => {
    pendingFiles.push(file);
    previewFile(file);
  });
  if (pendingFiles && pendingFiles.length) {
    submitButton.classList.remove('hidden');
    submitButton.classList.add('block');
  }
}

dropArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files), false);
async function submit() {
  try {
    const url = '/api/v1/photos/upload';
    const formData = new FormData();
    pendingFiles.forEach((photo) => {
      formData.append('files[]', photo);
    });

    const response = await fetch(url, {
      method: 'POST',
      cors: 'same-origin',
      credentials: 'same-origin',
      body: formData,
    });

    const data = await response.json();
    if (data.error) {
      toast(data.message, 'error');
      return;
    }
    // Simulate an HTTP redirect:
    window.location.replace('/');
  } catch (err) {
    toast('error occurred please try again later', 'error');
  }
}
submitButton.addEventListener('click', () => submit());
