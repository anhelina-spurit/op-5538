import { Listeners } from '../../../utils/listeners';
import { Modal } from '../../modal';

import './index.scss';

const SELECTORS = {
  SORT: '[data-sort]',
  SORT_MODAL: '#sort-modal',
};

class SortModal {
  /**
   * @class SortModal
   * @name SortModal
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    this._container = container;
    this._listeners = new Listeners();
    this._modalElement = this._container?.querySelector(SELECTORS.SORT_MODAL);

    this._modal = this._modalElement
      ? new Modal(this._modalElement, {
          isOverflow: window.innerWidth <= 768,
        })
      : null;

    this._listeners.add(window, 'click', (event) => {
      this._modal?.isVisible() && !event.target?.closest(SELECTORS.SORT) && !event.target?.closest(SELECTORS.SORT_MODAL)
        ? this._modal?.hide()
        : null;
    });
    this._listeners.add(this._container, 'click', () => {
      this._modal?.show();
    });
  }

  destroy() {
    this._listeners.removeAll();
  }
}

export { SortModal };
