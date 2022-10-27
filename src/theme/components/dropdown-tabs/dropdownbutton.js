const CLASSES = {
  BUTTON: 'dropdown-tabs__button',
};

class DropdownButton {
  constructor({ text = '', expand = false, tabSelector = '.tab' }) {
    this.element = document.createElement('button');
    this.element.classList.add(CLASSES.BUTTON);
    this.textContent = text;
    this.tabSelector = tabSelector;
    this.toggleState(expand);

    this.element.addEventListener('click', () => {
      this.toggleState();

      if (this.state) {
        this.element.addEventListener('focusout', this.onFocusOut.bind(this), { once: true });
        this.element.addEventListener('keyup', this.onKeyup.bind(this), { once: true });
      }
    });
  }

  /**
   * @return {Boolean} aria-expanded attribute value
   */
  get state() {
    return this.element.getAttribute('aria-expanded') === 'true';
  }

  /**
   * @param {String} value
   */
  set textContent(value) {
    this.element.textContent = value;
  }

  /**
   * @param {Boolean|null} state
   */
  toggleState(state) {
    const expanded = state === false ? false : !this.state;

    this.element.setAttribute('aria-expanded', expanded.toString());
    this.element.dispatchEvent(
      new CustomEvent('dropdown:expand', {
        detail: { expanded: this.state },
      }),
    );
  }

  onFocusOut() {
    setTimeout(() => {
      if (!document.activeElement.closest(this.tabSelector)) {
        this.toggleState(false);
      }
    }, 1);
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyup(event) {
    switch (event.key) {
      case 'Esc':
      case 'Escape':
        this.toggleState(false);
        break;
    }
  }
}

export default DropdownButton;
