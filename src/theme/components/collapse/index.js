import merge from 'lodash.merge';

import { onTransitionEnd } from '../../utils/on-transition-end';

import './collapse-panel';

const OPENED_ATTRIBUTE = 'data-collapse-opened';
const READY_ATTRIBUTE = 'data-collapse-ready';

const DEFAULT_OPTIONS = {
  duration: 500,
  timingFunction: 'ease',
  animate: true,
};

/**
 * Class representing a collapse
 */
class Collapse {
  /**
   * @class Collapse
   * @name Collapse
   *
   * @constructor
   * @param {HTMLButtonElement} button
   * @param {{ duration: Number, timingFunction: string }} [options]
   * */
  constructor(button, options) {
    this._isPanelAnimating = false;

    this._options = merge(DEFAULT_OPTIONS, options);

    this._elements = {};
    this._elements.button = button;
    this._elements.panel = document.getElementById(this._elements.button.getAttribute('aria-controls'));
    this._elements.content = this._elements.panel.querySelector('[data-collapse-content]');

    this._elements.button.addEventListener('click', this.togglePanel.bind(this));
  }

  /**
   * Toggle panel
   * @method isExpanded
   * @return {boolean}
   */
  isExpanded() {
    return this._elements.button.getAttribute('aria-expanded') === 'true';
  }

  /**
   * Toggle panel
   * @method togglePanel
   */
  togglePanel() {
    if (this._isPanelAnimating) return;
    this.isExpanded() ? this.hidePanel() : this.showPanel();
  }

  /**
   * Show panel
   * @method showPanel
   */
  showPanel() {
    if (this._isPanelAnimating) return;

    this._elements.panel.removeAttribute('hidden');

    if (!this._options.animate) {
      this._beforeOpen();
      this._afterOpen();

      return;
    }

    this._animateHeight({
      from: 0,
      to: this._getContentHeight(),
      onBefore: this._beforeOpen.bind(this),
      onFinish: this._afterOpen.bind(this),
    });
  }

  /**
   * Hide panel
   * @method hidePanel
   */
  hidePanel() {
    if (this._isPanelAnimating) return;

    if (!this._options.animate) {
      this._beforeHide();
      this._afterHide();

      return;
    }

    this._animateHeight({
      from: this._getContentHeight(),
      to: 0,
      onBefore: this._beforeHide.bind(this),
      onFinish: this._afterHide.bind(this),
    });
  }

  _beforeOpen() {
    this._elements.button.setAttribute(OPENED_ATTRIBUTE, '');
  }

  _afterOpen() {
    this._elements.button.setAttribute('aria-expanded', true);
    this._elements.panel.setAttribute(READY_ATTRIBUTE, '');
  }

  _beforeHide() {
    this._elements.button.removeAttribute(OPENED_ATTRIBUTE, '');
  }

  _afterHide() {
    this._elements.panel.setAttribute('hidden', '');
    this._elements.panel.setAttribute(READY_ATTRIBUTE, '');
    this._elements.button.setAttribute('aria-expanded', false);
  }

  /**
   * Animate panel
   * @method _animatePanel
   * @param {{ from: string, to: string, onBefore: Function, onFinish: Function }} options
   */
  _animateHeight({ from, to, onBefore, onFinish }) {
    if (this._isPanelAnimating) return;

    this._isPanelAnimating = true;
    this._elements.panel.style.cssText = `
      will-change: height;
      height: ${from}px;
      transition-property: height;
      transition-duration: ${this._options.duration}ms;
      transition-timing-function: ${this._options.timingFunction};
    `;

    if (typeof onBefore === 'function') onBefore();
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this._elements.panel.style.cssText += `height: ${to}px`;

        onTransitionEnd(
          this._elements.panel,
          () => {
            this._elements.panel.style.cssText = '';
            this._isPanelAnimating = false;
            if (typeof onFinish === 'function') onFinish();
          },
          {
            property: 'height',
            once: true,
          },
        );
      });
    }, 0);
  }

  /**
   * Get content height
   * @method _getContentHeight
   * @return number
   */
  _getContentHeight() {
    return this._elements.content.getBoundingClientRect().height;
  }
}

export { Collapse };
