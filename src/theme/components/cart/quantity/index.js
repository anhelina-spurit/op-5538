import debounce from 'lodash.debounce';

import Cart from '../cart';
import { ElementsEventReducer } from '../../../utils/elements-event-reducer';

import './index.scss';

const SELECTORS = {
  QUANTITY: '[data-cart-quantity]',
  QUANTITY_CONTROL: '[data-cart-quantity-control]',
  QUANTITY_INPUT: '[data-cart-quantity-input]',
  VIEW_FIELD: '[data-cart-quantity-viewfield]',
  TOTAL_CART_COUNT: '[data-cart-count]',
};

const ATTRIBUTES = {
  ACTION: 'data-cart-quantity-action',
};

/** Class representing a "Cart quantity" */
class CartQuantity {
  /**
   * @class CartQuantity
   * @name CartQuantity
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    this._container = container;
    this._cart = new Cart();
    this._changeInput = debounce(this._changeInput, 500);
    this._elementsEventReducer = new ElementsEventReducer(this._container, {
      click: {
        [SELECTORS.QUANTITY_CONTROL]: (event) => {
          const { target } = event;
          const input = target?.closest(SELECTORS.QUANTITY)?.querySelector(SELECTORS.QUANTITY_INPUT);
          const viewField = target?.closest(SELECTORS.QUANTITY)?.querySelector(SELECTORS.VIEW_FIELD);
          const value = parseInt(input.value, 10);
          let result;
          if (target.name === 'decrement') {
            result = value > 0 ? value - 1 : value;
          } else {
            result = parseInt(input.value, 10) + 1;
          }
          input.value = result;
          input.setAttribute(ATTRIBUTES.ACTION, target.name);
          viewField.textContent = result;
          this._changeInput(input);
        },
      },
    });

    this._cart.on('cart:change', (response) => {
      if (response.type === 'error') return;
      const totalCountElement = document.querySelector(SELECTORS.TOTAL_CART_COUNT);
      if (response.token) {
        const result = response.items.reduce((previousValue, currentValue) => {
          return previousValue + Number(currentValue.quantity);
        }, 0);
        totalCountElement.innerHTML = result > 0 ? result.toString() : '';
      } else {
        let totalCartCount = parseInt(totalCountElement.innerHTML, 10) || 0;
        totalCartCount++;
        totalCountElement.innerHTML = totalCartCount.toString();
      }
    });
  }

  /**
   * @method getState
   * @param input {HTMLElement|Element|Node|Object}
   */
  _changeInput(input) {
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

export { CartQuantity };
