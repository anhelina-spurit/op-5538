import debounce from 'lodash.debounce';

import { Collapse } from '../../collapse';

import './index.scss';

const SELECTORS = {
  BUTTON: '[data-collapse-button]',
};

const BREAKPOINT = 768;
const DURATION = 200;
const DEBOUNCE_TIME = 300;

class FooterMenu {
  constructor(container) {
    this.prew_window_width = window.innerWidth;
    this.buttons = container.querySelectorAll(SELECTORS.BUTTON);

    this.buttons.forEach((button) => {
      button.collapse = new Collapse(button, { duration: DURATION, animate: false });
    });

    window.addEventListener('resize', debounce(this._handleWindowResize.bind(this), DEBOUNCE_TIME));
    window.dispatchEvent(new Event('resize'));
    this._changeMenu();
  }

  showNav() {
    this.buttons.forEach((button) => requestAnimationFrame(() => button.collapse.showPanel()));
  }

  hideNav() {
    this.buttons.forEach((button) => requestAnimationFrame(() => button.collapse.hidePanel()));
  }

  _changeMenu() {
    if (window.innerWidth >= BREAKPOINT) {
      this.showNav();
    } else {
      this.hideNav();
    }
  }

  _handleWindowResize() {
    if (window.innerWidth !== this.prew_window_width) {
      this.prew_window_width = window.innerWidth;
      this._changeMenu();
    }
  }
}

export { FooterMenu };
