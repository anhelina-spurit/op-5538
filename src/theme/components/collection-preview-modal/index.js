import './index.scss';

import { Listeners } from '../../utils/listeners';
import { Modal } from '../modal';
import Cart from '../cart/cart';

const SELECTORS = {
  MODAL: '#collections-preview-slider-modal',
};

/** Class representing a "CollectionsPreviewSlider" */
class CollectionsPreviewModal {
  /**
   * @class CollectionsPreviewSlider
   * @name CollectionsPreviewSlider
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    this.container = container;
    this._cart = new Cart();
    this._listeners = new Listeners();
    this._modalElem = this.container.querySelector(SELECTORS.MODAL);
    this._modal = new Modal(this._modalElem);
    this._listeners.add(document, 'dot:click', this.open.bind(this));
    this._cart.on('cart:change', this.close.bind(this));
  }

  /**
   * @method destroy
   */
  destroy() {
    this._listeners.removeAll();
  }

  /**
   * @method open
   */
  open() {
    this._modal.show();
  }

  /**
   * @method close
   */
  close() {
    this._modal.hide();
  }
}

export { CollectionsPreviewModal };
