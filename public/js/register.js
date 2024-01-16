/* eslint-disable import/extensions */
import { toast } from './toast.js';
import { togglePassword } from './forms.js';

const signUpButton = document.getElementById('sign-up-button');
const show = document.getElementById('show');

async function register() {
  let form = document.forms.namedItem('register');
  const body = {};
  form = Array.from(form); // convert to array

  form.forEach((child) => {
    if (child.tagName === 'INPUT') {
      body[child.id] = child.value;
    }
  });
  const url = '/api/v1/users/register';
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

signUpButton.addEventListener('click', () => register(), false);
show.addEventListener('click', () => togglePassword(), false);
