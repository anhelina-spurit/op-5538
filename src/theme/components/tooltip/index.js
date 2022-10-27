import { createPopper } from '@popperjs/core';

import { Listeners } from '../../utils/listeners';
import './index.scss';
import Cart from '../cart/cart';

const SELECTORS = {
  DOT: '[data-dot]',
  ARROW: '[data-tooltip-arrow]',
  CLOSE: '[data-tooltip-close]',
  TOOLTIP: '[data-tooltip]',
};

const CLASSES = {
  ACTIVE: 'active',
};

class Tooltip {
  /**
   * @class Tooltip
   * @name Tooltip
   *
   * @constructor
   * @param tooltip {HTMLElement}
   * */
  constructor(tooltip) {
    this.tooltip = tooltip;
    this.button = document.querySelector(`#${tooltip.dataset.controlledBy}`);
    this._cart = new Cart();
    this._listeners = new Listeners();
    this._init();
  }

  /**
   * @method destroy
   */
  destroy() {
    this._listeners.removeAll();
  }

  /**
   * @method _show
   */
  _show() {
    this.tooltip.classList.add(CLASSES.ACTIVE);
    this.tooltipInstance.update();
  }

  _hide(event) {
    const { target } = event;
    if (!target.closest(SELECTORS.TOOLTIP) && !target.closest(SELECTORS.DOT)) {
      this.tooltip.classList.remove(CLASSES.ACTIVE);
    }
  }

  _hideCurrent() {
    this.tooltip.classList.remove(CLASSES.ACTIVE);
  }

  /**
   * @method _init
   */
  _init() {
    const arrow = this.tooltip.querySelector(SELECTORS.ARROW);
    this.tooltipInstance = createPopper(this.button, this.tooltip, {
      modifiers: [
        {
          name: 'arrow',
          options: {
            element: arrow,
          },
        },
      ],
    });

    this._listeners.add(this.button, 'click', this._show.bind(this));
    this._listeners.add(this.tooltip.querySelector(SELECTORS.CLOSE), 'click', this._hideCurrent.bind(this));
    this._listeners.add(document, 'click', this._hide.bind(this));
  }
}

export { Tooltip };
