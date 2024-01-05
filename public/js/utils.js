const mb = 1048576;
const kb = 1024;

function returnFileSize(number) {
  if (number < kb) {
    return `${number} bytes`;
  }
  if (number >= kb && number < mb) {
    return `${(number / kb).toFixed(1)} KB`;
  }
  if (number >= mb) {
    return `${(number / mb).toFixed(1)} MB`;
  }
  return '';
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

export { mb, kb, returnFileSize, preventDefaults };
