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
  const url = 'http://localhost:4001/api/v1/users/login';
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
      const toast = document.getElementById('toast');
      const toastText = document.getElementById('toast-text');
      toastText.innerText = data.message;
      toast.classList.remove('opacity-0');
      toast.classList.add('opacity-100');
      setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
      }, '3000');
    }
  } catch (err) {
    console.error(err);
  }
}
