const rotationClasses = {
  0: [''],
  90: ['rotate-[90deg]', 'origin-left', 'translate-x-1/2', '-translate-y-1/2'],
  180: ['rotate-[180deg]'],
  270: ['rotate-[270deg]', 'origin-right', '-translate-x-1/2', '-translate-y-1/2'],
};

class ModalImage {
  id;

  rotation = 0;

  orientation;

  currentWidth;

  currentHeight;

  originalWidth;

  containerWidth;

  containerHeight;

  classNames = '';

  src;

  element;

  isFavourite = false;

  constructor(id, src, element, containerWidth, containerHeight, isFavourite) {
    this.id = id;
    this.containerWidth = containerWidth * 0.9;
    this.containerHeight = containerHeight * 0.9;
    this.src = src;
    this.element = element;
    this.originalWidth = element.naturalWidth;
    this.orginalHeight = element.naturalHeight;
    if (this.originalWidth > this.orginalHeight) {
      this.orientation = 'landscape';
    } else {
      this.orientation = 'portrait'; // if same doesnt matter
    }
    this.isFavourite = isFavourite;

    [this.currentWidth, this.currentHeight] = this.calculateInitialDimensions();
    this.setPixelDimensions();
  }

  setPixelDimensions() {
    this.element.style['max-width'] = `${this.currentWidth}px`;
    this.element.style['max-height'] = `${this.currentHeight}px`;
  }

  // Get image dimensions that will fit on the screen
  calculateInitialDimensions() {
    // Check if image needs to be scaled
    let scale = 1;

    // no scaling needed
    if (this.originalWidth < this.containerWidth && this.orginalHeight < this.containerHeight) {
      scale = 1;
    }

    // scale the large of width/height
    if (this.originalWidth > this.containerWidth && this.orginalHeight > this.containerHeight) {
      scale = Math.min(this.containerWidth / this.originalWidth, this.containerHeight / this.orginalHeight);
    }

    // scale width to container width
    if (this.originalWidth > this.containerWidth && this.orginalHeight < this.containerHeight) {
      scale = this.containerWidth / this.originalWidth;
    }

    // scale height to container height
    if (this.originalWidth < this.containerWidth && this.orginalHeight > this.containerHeight) {
      scale = this.containerHeight / this.orginalHeight;
    }

    return [this.originalWidth * scale, this.orginalHeight * scale];
  }

  rotate(degrees) {
    let newOrientation = Number(this.rotation) + degrees;
    newOrientation %= 360;
    if (newOrientation < 0) {
      newOrientation += 360;
    }
    if (this.rotation !== 0) {
      this.element.classList.remove(...rotationClasses[this.rotation]);
    }

    if (newOrientation !== 0) {
      this.element.classList.add(...rotationClasses[newOrientation]);
    }
    this.rotation = newOrientation;
  }

  toggleFavourite(favouriteButton) {
    this.isFavourite = !this.isFavourite;
    const icon = favouriteButton.children[0];
    if (this.isFavourite) {
      // eslint-disable-next-line no-param-reassign
      icon.src = 'icons/star-fill.svg';
    } else {
      // eslint-disable-next-line no-param-reassign
      icon.src = 'icons/star.svg';
    }
  }

  close() {
    if (this.rotation !== 0) {
      this.element.classList.remove(...rotationClasses[this.rotation]);
    }
  }
}
export { ModalImage };
