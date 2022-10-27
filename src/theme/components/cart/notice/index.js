const CLASSES = {
  HEADING: 'cart-notice__heading',
  CONTENT: 'cart-notice__content',
  MODIFIER: 'cart-notice--',
};

const STATUSES = {
  ERROR: '422',
};

class CartNotice {
  constructor() {
    this._notice = null;
  }

  setResponse(value = {}) {
    if (value.status && value.status.toString() === STATUSES.ERROR) {
      this.createNotice({
        heading: value.message,
        content: value.description,
        mode: 'error',
      });
    }
  }

  createNotice({ heading, content, mode }) {
    this._notice = document.createElement('div');

    if (heading) {
      const elHeading = document.createElement('div');
      elHeading.classList.add(CLASSES.HEADING);
      elHeading.textContent = heading;
      this._notice.append(elHeading);
    }

    if (content) {
      const elContent = document.createElement('div');
      elContent.classList.add(CLASSES.CONTENT);
      elContent.textContent = content;
      this._notice.append(elContent);
    }

    if (mode) {
      this._notice.classList.add(`${CLASSES.MODIFIER}${mode}`);
    }
  }

  destroy() {
    if (this._notice) {
      this._notice.remove();
      this._notice = null;
    }
  }

  render() {
    return this._notice ? this._notice : '';
  }
}

export { CartNotice };
