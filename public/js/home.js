/* eslint-disable import/extensions */
import { modalOpen } from './modal.js';

const galleryItems = document.getElementsByClassName('gallery-item');
Array.from(galleryItems).forEach((item) => {
  item.classList.add('cursor-pointer');
  const isFavourite = item.getAttribute('data-is-favourite');
  item.addEventListener('click', () => modalOpen(item.children[0].src, item.id, isFavourite), false);
});
