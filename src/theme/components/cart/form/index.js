import Cart from '../cart';
import { CartQuantity } from '../quantity';
import { ElementsEventReducer } from '../../../utils/elements-event-reducer';
import { CartModifier } from '../modifier';
import { Wishlist } from '../../wishlist/wishlist';
import { CartNotice } from '../notice';
import { templateAPI } from '../../../api/shopify/template';

import '../item';
import '../info';
import './index.scss';

const SELECTORS = {
  FORM: '[data-cart-form]',
  ITEM: '[data-cart-item]',
  REMOVE: '[data-cart-remove]',
  QUANTITY: '[data-cart-quantity]',
  QUANTITY_INPUT: '[data-cart-quantity-input]',
  ADDITIONAL: '[data-additional-product]',
  COUNTER: '[data-cart-counter]',
  FORM_COUNT: '[data-cart-form-count]',
  CHECKOUT: '[data-cart-checkout]',
  MODIFIER: '[data-cart-modifier]',
  WISHLIST: '[data-card-wishlist]',
  NOTICE: '[data-cart-notice]',
};

const ATTRIBUTES = {
  ACTION: 'data-cart-quantity-action',
};

/** Class representing a "Cart view" */
class CartView {
  /**
   * @class CartView
   * @name CartView
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    this._container = container;
    this._cart = new Cart();
    this._cartNotice = new CartNotice();
    this._wishlist = new Wishlist(this._container);
    this._cartUrl = theme.routes.cart_url;
    this._quantity = new CartQuantity(this._container);
    this._modifier = new CartModifier();
    this._initEventListeners();

    this._render = this._render.bind(this);
  }

  /**
   * @method destroy
   */
  destroy() {
    this._elementsEventReducer.destroy();
  }

  /**
   * @method renderVP
   */
  renderVP() {
    document.dispatchEvent(new Event('vp-rerender'));
  }

  /**
   * @method _renderNotice
   * @param response {Object}
   */
  _renderNotice(response) {
    const noticeElement = document.querySelector(SELECTORS.NOTICE);
    if (noticeElement) {
      this._cartNotice.destroy();
      if (response?.type === 'error') {
        this._cartNotice.createNotice({
          heading: response.messages,
          mode: response?.type,
        });
      }
      noticeElement.append(this._cartNotice.render());
    }
  }

  /**
   * @method _render
   */
  _render() {
    const url = new URL(this._cartUrl, window.location.origin);
    url.searchParams.append('view', 'ajax');

    const button = this._container.querySelector(SELECTORS.CHECKOUT);
    button ? button.setAttribute('disabled', true) : null;

    templateAPI
      .get(url.href)
      .then((html) => {
        const resultsDOM = new DOMParser().parseFromString(html, 'text/html');
        const counterDOM = resultsDOM.querySelector(SELECTORS.FORM_COUNT)?.value;
        const counter = this._container.querySelector(SELECTORS.COUNTER);
        counter && counterDOM ? (counter.textContent = counterDOM) : null;
        this._container.querySelector(SELECTORS.FORM).innerHTML = html;
        button ? button.setAttribute('disabled', false) : null;
        typeof window?.SmartWishlistMain === 'function' && window?.SmartWishlistMain();
        this.renderVP();
      })
      .catch(console.error); // eslint-disable-line no-console
  }

  /**
   * @method _initEventListeners
   */
  _initEventListeners() {
    this._elementsEventReducer = new ElementsEventReducer(this._container.querySelector(SELECTORS.FORM), {
      change: {
        [SELECTORS.QUANTITY]: (event) => {
          const { target } = event;
          const id = target.closest(SELECTORS.ITEM).id;
          const value = Number(event.target.value);
          this._cart.changeItem(id, value, target.getAttribute(ATTRIBUTES.ACTION));
        },
      },
      click: {
        [SELECTORS.REMOVE]: (event) => {
          const { target } = event;
          const itemId = target.closest(SELECTORS.ITEM).id;
          this._cart.remove([itemId]);
        },
        [SELECTORS.MODIFIER]: (event) => {
          const { target } = event;
          const item = target.closest(SELECTORS.ITEM);
          this._modifier.init(target, item);
        },
        [SELECTORS.WISHLIST]: (event) => {
          const { target } = event;
          const wishlist = target.closest(SELECTORS.WISHLIST);
          this._wishlist.change(wishlist);
        },
      },
    });
    this._cart.on('cart:change', (response) => {
      this._renderNotice(response);
      this._render();
    });
  }
}

export { CartView };
