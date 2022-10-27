import { Collapse } from '../../collapse';

import './index.scss';

const SELECTORS = {
  BUTTON: '[data-collapse-button]',
  SIGN_IN_COLLAPSE_BUTTON: '#sign_in_collapse_button',
};

const BREAKPOINT = 768;
const DURATION = 200;
const PASSWORD_RECOVERY_HASH = '#recover';

class LoginCollapseButton {
  constructor(container) {
    this.buttons = container.querySelectorAll(SELECTORS.BUTTON);
    this.signInCollapseButton = container.querySelector(SELECTORS.SIGN_IN_COLLAPSE_BUTTON);

    this.buttons.forEach((button) => {
      button.collapse = new Collapse(button, { duration: DURATION });
    });

    this._init();
  }

  showSpecificPanel(button) {
    if (!button) return;

    requestAnimationFrame(() => button.collapse.showPanel());
  }

  showPanel() {
    this.buttons.forEach((button) => requestAnimationFrame(() => button.collapse.showPanel()));
  }

  hidePanel() {
    this.buttons.forEach((button) => requestAnimationFrame(() => button.collapse.hidePanel()));
  }

  _init() {
    if (window.innerWidth >= BREAKPOINT) {
      this.showPanel();
    } else if (window.location.hash === PASSWORD_RECOVERY_HASH && this.signInCollapseButton) {
      this.showSpecificPanel(this.signInCollapseButton);
    } else {
      this.hidePanel();
    }
  }
}

export { LoginCollapseButton };
