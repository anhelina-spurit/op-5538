import { ElementsEventReducer } from '../../utils/elements-event-reducer';
import Cart from '../cart/cart';
import { preventDefault } from '../../utils/prevent-default';
import { templateAPI } from '../../api/shopify/template';
import { Wishlist } from '../wishlist/wishlist';

import '../product-label/index';
import '../smartwishlist';
import '../swatches';
import './index.scss';

const SELECTORS = {
  CARD: '[data-product-card]',
  FORM: '[data-product-card-form]',
  BUTTON: '[data-product-card-button]',
  CLOSE: '[data-product-card-close]',
  OPTION: '[data-product-card-option]',
  WISHLIST: '[data-product-card-wishlist]',
  JSON: '[data-product-json]',
  VARIANT_ID: '[data-product-card-variant-id]',
  HANDLE: '[data-handle]',
};

const ATTRIBUTES = {
  HANDLE: 'data-handle',
  CARD_HANDLE: 'data-product-card-handle',
};

const CLASSES = {
  ACTIVE: 'active',
  VP_PRICE_CHANGED: 'vp-price-changed',
};

class ProductCard {
  /**
   * @class ProductCard
   * @name ProductCard
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    this._container = container;
    this._cart = new Cart();
    this._wishlist = new Wishlist();
    this._elementsEventReducer = new ElementsEventReducer(this._container, {
      change: {
        [SELECTORS.FORM]: (event) => {
          const { target } = event;
          const form = target.closest(SELECTORS.FORM);
          const currentOption = form.querySelector(`${SELECTORS.OPTION}:checked`).value;
          const product_json = JSON.parse(form.querySelector(SELECTORS.JSON).textContent);
          product_json?.forEach((variant) => {
            if (variant.options.some((item) => currentOption === item)) {
              form.querySelector(SELECTORS.VARIANT_ID).value = variant.id;
              this._cart
                .add([{ id: variant.id, quantity: 1, properties: {} }])
                .then(() => form.reset())
                // eslint-disable-next-line no-console
                .catch((error) => console.error(error));
            }
          });
        },
      },
      click: {
        [SELECTORS.BUTTON]: (event) => {
          const card = event.target.closest(SELECTORS.CARD);
          card.classList.toggle(CLASSES.ACTIVE);
        },
        [SELECTORS.CLOSE]: (event) => {
          const card = event.target.closest(SELECTORS.CARD);
          card.classList.toggle(CLASSES.ACTIVE);
        },
        [SELECTORS.HANDLE]: preventDefault((event) => {
          const { target } = event;
          this._getItem(target, event.target.getAttribute(ATTRIBUTES.HANDLE));
        }),
        [SELECTORS.WISHLIST]: (event) => {
          const { target } = event;
          const wishlist = target.closest(SELECTORS.WISHLIST);
          this._wishlist.change(wishlist);
        },
      },
    });
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
  renderVP(target) {
    target.closest(SELECTORS.CARD).classList.remove(CLASSES.VP_PRICE_CHANGED);
    document.dispatchEvent(new Event('vp-rerender'));
  }

  /**
   * @method _render
   * @param target {HTMLElement}
   * @param html {string}
   */
  _render(target, html) {
    const results = new DOMParser().parseFromString(html, 'text/html');
    const newCard = results.querySelector(SELECTORS.CARD);
    target.closest(SELECTORS.CARD).replaceWith(newCard);
    typeof window?.SmartWishlistMain === 'function' && window?.SmartWishlistMain();
    this.renderVP(target);
  }

  /**
   * @method _getItem
   * @param target {HTMLElement}
   * @param handle {string}
   */
  _getItem(target, handle) {
    const url = new URL(`/products/${handle}`, window.location.origin);
    const cardHandle = target.closest(SELECTORS.CARD).getAttribute(ATTRIBUTES.CARD_HANDLE);
    url.searchParams.append('view', cardHandle);
    templateAPI
      .get(url)
      .then((html) => {
        this._render(target, html);
      })
      .catch(console.error); // eslint-disable-line no-console
  }
}

export { ProductCard };
