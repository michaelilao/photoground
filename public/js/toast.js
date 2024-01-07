const toastParent = document.getElementById('toast');
const toastText = document.getElementById('toast-text');

function toast(message, type) {
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
export { toast };
