// eslint-disable-next-line no-unused-vars
function togglePassword() {
  const password = document.getElementById('password');
  const show = document.getElementById('show').children[0];
  if (password.type === 'password') {
    password.type = 'text';
    show.src = 'icons/eye-open.svg';
  } else {
    password.type = 'password';
    show.src = 'icons/eye-closed.svg';
  }
}
