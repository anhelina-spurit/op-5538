import Cart from '../cart';
import { CartModifierModal } from '../modifier-modal';
import { templateAPI } from '../../../api/shopify/template';
import { ElementsEventReducer } from '../../../utils/elements-event-reducer';
import { preventDefault } from '../../../utils/prevent-default';

import './index.scss';

const SELECTORS = {
  MODAL: '#cart-modifier-modal',
  FORM: '[data-product-form]',
  CONTENT: '[data-cart-modifier-modal-content]',
  QUANTITY_INPUT: '[data-cart-quantity-input]',
  HANDLE: '[data-handle]',
  OPTION: '[data-option-value]',
  JSON: '[data-product-json]',
  ADD: 'button[name="add"]',
  ID: 'input[name="id"]',
  ERROR: '[data-modifier-error]',
};

const DATA_ATTRIBUTES = {
  URL: 'data-cart-modifier-url',
  ITEM: 'data-cart-item',
  PRODUCT_URL: 'data-product-url',
};

const RESPONSE_STATUSES = {
  ERROR: 422,
};

/** Class representing a "modifier Cart" */
class CartModifier {
  /**
   * @class CartModifier
   * @name CartModifier
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    this._container = container;
    this._cart = new Cart();
    this._modifireModal = new CartModifierModal();
    this._modalElem = this._container.querySelector(SELECTORS.MODAL);
    this._elementsEventReducer = new ElementsEventReducer(this._container.querySelector(SELECTORS.CONTENT), {
      click: {
        [SELECTORS.HANDLE]: preventDefault((event) => {
          const { target } = event;
          this.load(target.href);
        }),
        [SELECTORS.ADD]: preventDefault((event) => {
          const { target } = event;
          const addedProductId = target.closest(SELECTORS.FORM).querySelector(SELECTORS.ID).value;
          this._cart
            .modifierItem(addedProductId, this._removeProductKey, this._addedQuantity)
            .then((res) => {
              res?.status === RESPONSE_STATUSES.ERROR && this._setError(res.description);
            })
            .catch((error) => console.error(error)); // eslint-disable-line no-console
        }),
      },
      change: {
        [SELECTORS.OPTION]: (event) => {
          const { target } = event;
          const form = target.closest(SELECTORS.FORM);
          let currentOptions = [];
          form.querySelectorAll(`${SELECTORS.OPTION}:checked`).forEach((item) => {
            currentOptions = [...currentOptions, item.value];
          });
          const product_json = JSON.parse(this._modalElem.querySelector(SELECTORS.JSON).textContent);
          product_json?.forEach((variant) => {
            if (
              variant.options.length === currentOptions.length &&
              variant.options.every((item, index) => currentOptions[index] === item)
            ) {
              this.load(`${form.getAttribute(DATA_ATTRIBUTES.PRODUCT_URL)}?variant=${variant.id}`);
            }
          });
        },
      },
    });
    this._cart.on('cart:change', () => this._modifireModal.close());
  }

  /**
   * @method init
   * @param target {HTMLElement|Element|Node|Object}
   * @param item {HTMLElement|Element|Node|Object}
   */
  init(target, item) {
    this._removeProductKey = item.id;
    this._removeProductId = item.getAttribute(DATA_ATTRIBUTES.ITEM);
    this._addedQuantity = parseInt(item.querySelector(SELECTORS.QUANTITY_INPUT).value, 10);
    this.load(target.getAttribute(DATA_ATTRIBUTES.URL));
  }

  /**
   * @method load
   * @param baseUrl {String}
   */
  load(baseUrl) {
    const urlWithParams = new URL(baseUrl, window.location.origin);
    urlWithParams.searchParams.append('view', 'modifier');
    templateAPI
      .get(urlWithParams)
      .then((html) => {
        this._render(html);
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }

  _setError(description) {
    const errorField = this._modalElem.querySelector(SELECTORS.ERROR);
    errorField.textContent = description;
  }

  /**
   * @method _render
   * @param html {String}
   */
  _render(html) {
    const content = this._modalElem.querySelector(SELECTORS.CONTENT);
    content.innerHTML = html;
    this._modifireModal.open();
    if (this._removeProductId === content.querySelector(SELECTORS.ID).value) {
      content.querySelector(SELECTORS.ADD).disabled = true;
    }
  }
}

export { CartModifier };
