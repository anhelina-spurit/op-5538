import EventEmitter from 'eventemitter3';

import { ElementsEventReducer } from '../../../utils/elements-event-reducer';
import { templateAPI } from '../../../api/shopify/template';
import { preventDefault } from '../../../utils/prevent-default';
import QuantityInput from '../../quantity';
import { Modal } from '../../modal';

import './index.scss';

const SELECTORS = {
  ITEM: '[data-bundle-item]',
  JSON: '[data-bundle-item-json]',
  SWATCH: '[data-option-swatches] [data-handle]',
  OPTION: '[data-option-value]',
  QUANTITY: '[data-quantity-input]',
  ID_INP: '[name="id"]',
  HANDLE: '[name="handle"]',
  MODAL_BTN: '[data-bundle-item-modal-btn]',
  MODAL: '[data-bundle-item-modal]',
  PRODUCT_INFO: '.product__info',
};

const ADDITIONAL_CLASS = 'product__info--relative';

class BundleItem extends EventEmitter {
  constructor(element) {
    super();

    this._element = element;
    this._parentProductInfo = this._element.closest(SELECTORS.PRODUCT_INFO);

    this._quantity = null;

    this.setVariant();
    this.initModal();
    this.initQuantity();

    this._elementsEventReducer = new ElementsEventReducer(this._element, {
      click: {
        [SELECTORS.SWATCH]: preventDefault((event) => {
          this.change(event.target.dataset.handle);
        }),
        [SELECTORS.MODAL_BTN]: preventDefault(() => {
          this._modal.show();
          this._parentProductInfo.classList.add(ADDITIONAL_CLASS);
        }),
      },
      change: {
        [SELECTORS.OPTION]: () => {
          this.setVariant();
          this.change(this.getHandle(), this.getId());
        },
        [SELECTORS.QUANTITY]: () => this.emit('change', this),
      },
    });
  }

  setVariant(reset) {
    if (reset) {
      this._variantsData = null;
    }

    this._options = this.getOptions();
    this._variant = this.getVariant();
  }

  initModal() {
    this._modalBtn = this._element.querySelector(SELECTORS.MODAL_BTN);
    this._modalElement = this._element.querySelector(SELECTORS.MODAL);
    this._modal = new Modal(this._modalElement, {
      callbacks: {
        onHide: () => {
          this._parentProductInfo.classList.remove(ADDITIONAL_CLASS);
        },
      },
    });
  }

  initQuantity() {
    const component = this._element.querySelector(SELECTORS.QUANTITY);

    if (component) {
      this._quantity = new QuantityInput(component);
    }
  }

  getOptions() {
    return Array.from(this._element.querySelectorAll(SELECTORS.OPTION)).map((option) => option.value);
  }

  getVariantsData() {
    this._variantsData = this._variantsData || JSON.parse(this._element.querySelector(SELECTORS.JSON).textContent);
    return this._variantsData;
  }

  getVariant() {
    return this.getVariantsData().find((variant) => {
      return (
        variant.options.length === this._options.length && variant.options.every((item, i) => this._options[i] === item)
      );
    });
  }

  getId() {
    return this._variant ? this._variant.id : this._element.querySelector(SELECTORS.ID_INP)?.value;
  }

  getQuantity() {
    return this._quantity ? parseInt(this._quantity.input.value, 10) : 1;
  }

  getPrice(total) {
    if (this._variant) {
      return total ? this._variant.price * this.getQuantity() : this._variant.price;
    }

    return 0;
  }

  getHandle() {
    return this._element.querySelector(SELECTORS.HANDLE)?.value;
  }

  isAvailable() {
    return this._variant ? this._variant.available : false;
  }

  change(productHandle, variantId) {
    if (!productHandle) return;

    const requestUrl = new URL(`/products/${productHandle}`, window.location.origin);
    requestUrl.searchParams.append('view', 'bundle-item');

    if (variantId) requestUrl.searchParams.append('variant', variantId);

    templateAPI
      .get(requestUrl)
      .then((html) => {
        const shadow = document.createElement('div');
        shadow.innerHTML = html;
        const newItem = shadow.querySelector(SELECTORS.ITEM);
        this._element.innerHTML = newItem.innerHTML;

        this.setVariant(true);
        this.initModal();
        this.initQuantity();

        this.emit('change', this);
      })
      .catch(console.error); // eslint-disable-line no-console
  }
}

export default BundleItem;
