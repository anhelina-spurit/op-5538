import { Modal } from '../../modal';
import './index.scss';

const SELECTORS = {
  MODAL: '#cart-modifier-modal',
};

class CartModifierModal {
  /**
   * @class CartModifier
   * @name CartModifier
   *
   * @constructor
   * */
  constructor(container = document) {
    this._container = container;
    this._modal = new Modal(this._container.querySelector(SELECTORS.MODAL));
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

export { CartModifierModal };
