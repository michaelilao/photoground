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
// eslint-disable-next-line no-unused-vars
async function login() {
  let form = document.forms.namedItem('login');
  const body = {};
  form = Array.from(form); // convert to array

  form.forEach((child) => {
    if (child.tagName === 'INPUT') {
      body[child.id] = child.value;
    }
  });
  const url = '/api/v1/users/login';
  try {
    const response = await fetch(url, {
      method: 'POST',
      cors: 'same-origin',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
