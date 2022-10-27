import Cart from '../cart/cart';

import '../swatches';
import './index.scss';

const SELECTORS = {
  FORM: '[data-product-form]',
  JSON: '[data-product-json]',
  INPUT: '[data-option-value]',
  ADD_BTN: '[name="add"]',
  PICKUP_BTN: '[data-socloz-product-id]',
};

const CLASSES = {
  LOADING: 'is-loading',
  VP_PRICE_CHANGED: 'vp-price-changed',
};

class ProductForm {
  constructor({ container = document }) {
    this.form = container.querySelector(SELECTORS.FORM);
    this.addButton = this.form.querySelector(SELECTORS.ADD_BTN);
    this.pickupButton = container.querySelector(SELECTORS.PICKUP_BTN);
    this.section = this.form.dataset.section;
    this.url = this.form.dataset.productUrl;

    this._cart = new Cart();

    this.updateOptions();
    this.updateMasterId();

    this.form.addEventListener('change', (evt) => {
      if (evt.target.matches(SELECTORS.INPUT)) {
        this.onVariantChange();
      }
    });

    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
  }

  onSubmitHandler(event) {
    if (!this.currentVariant) {
      return;
    }

    event.preventDefault();

    this._cart
      .add([{ id: this.currentVariant.id, quantity: 1, properties: {} }])
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.updatePickupButton(this.currentVariant);

    if (this.currentVariant) {
      this.updateURL();
      this.renderProductInfo();
    }
  }

  renderVP() {
    this.form.setAttribute('data-vp-id', this.currentVariant.id);
    this.form.classList.remove(CLASSES.VP_PRICE_CHANGED);
    document.dispatchEvent(new Event('vp-rerender'));
  }

  updateOptions() {
    this.values = Array.from(this.form.querySelectorAll(`${SELECTORS.INPUT}:checked`)).map((option) => option.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return (
        variant.options.length === this.values.length && variant.options.every((item, i) => this.values[i] === item)
      );
    });

    this.form.id.value = this.currentVariant ? this.currentVariant.id : '';
  }

  updateURL() {
    if (!this.currentVariant) {
      return;
    }

    window.history.replaceState({}, '', `${this.url}?variant=${this.currentVariant.id}`);
  }

  toggleAddButton(disable = true) {
    if (!this.addButton) {
      return;
    }

    if (disable) {
      this.addButton.setAttribute('disabled', 'disabled');
      this.addButton.textContent = window.variantStrings.unavailable;
    } else {
      this.addButton.removeAttribute('disabled');
      this.addButton.textContent = window.variantStrings.addToCart;
    }
  }

  updatePickupButton(variant) {
    if (!this.pickupButton || !variant) {
      return;
    }

    if (variant.available) {
      this.pickupButton.removeAttribute('disabled');
    } else {
      this.pickupButton.setAttribute('disabled', 'disabled');
    }

    this.pickupButton.setAttribute('data-socloz-product-id', variant.id);
  }

  renderBlock(name, source) {
    const destination = document.getElementById(`${name}-${this.section}`);
    const target = source.getElementById(`${name}-${this.section}`);

    if (target && destination) {
      destination.innerHTML = target.innerHTML;
    }
  }

  renderProductInfo() {
    this.form.classList.add(CLASSES.LOADING);

    fetch(`${this.url}?variant=${this.currentVariant.id}&section_id=${this.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');

        this.renderBlock('status', html);
        this.toggleAddButton(!this.currentVariant.available);
        this.renderVP();
      })
      .finally(() => this.form.classList.remove(CLASSES.LOADING))
      .catch((error) => error);
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.form.querySelector(SELECTORS.JSON).textContent);

    return this.variantData;
  }
}

export default ProductForm;
