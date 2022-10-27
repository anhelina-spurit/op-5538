import { formatMoney } from '@shopify/theme-currency';

import { ElementsEventReducer } from '../../utils/elements-event-reducer';
import Cart from '../cart/cart';

import BundleItem from './bundle-item';

import './index.scss';

const SELECTORS = {
  ELEMENT: '[data-bundle]',
  ITEM: '[data-bundle-item]',
  PRICE: '[data-bundle-price]',
  ADD_BTN: '[name="add"]',
};

const MONEY_FORMAT = window.theme.money_format || '€{{amount_with_comma_separator}}';

class ProductBundle {
  constructor({ container = document }) {
    this._element = container.querySelector(SELECTORS.ELEMENT);
    this._price = this._element.querySelector(SELECTORS.PRICE);
    this._addButton = this._element.querySelector(SELECTORS.ADD_BTN);
    this._items = [];

    this._cart = new Cart();
    this.initItems();

    this._elementsEventReducer = new ElementsEventReducer(this._element, {
      click: {
        [SELECTORS.ADD_BTN]: () => this.addToCart(),
      },
    });
  }

  initItems() {
    this._element?.querySelectorAll(SELECTORS.ITEM).forEach((item) => {
      const bundleItem = new BundleItem(item);

      bundleItem.on('change', this.handleChange.bind(this));
      this._items.push(bundleItem);
    });
  }

  addToCart() {
    const variants = this._items.map((item) => ({
      id: item.getId(),
      quantity: item.getQuantity(),
    }));

    this._cart.add(variants);
  }

  toggleAddButton(disable = true) {
    if (!this._addButton) return;

    if (disable) {
      this._addButton.setAttribute('disabled', 'disabled');
      this._addButton.textContent = window.variantStrings.unavailable;
    } else {
      this._addButton.removeAttribute('disabled');
      this._addButton.textContent = window.variantStrings.addToCart;
    }
  }

  handleChange() {
    const newPrice = this._items.reduce((currentPrice, item) => currentPrice + item.getPrice(true), 0);
    this._price.innerText = formatMoney(newPrice, MONEY_FORMAT);
    this.toggleAddButton(this._items.some((item) => !item.isAvailable()));
  }
}

export default ProductBundle;
