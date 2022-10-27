import { register } from '@shopify/theme-sections';

import { CartView } from './form';

import './index.scss';

register('cart', {
  _cartView: null,
  onLoad() {
    this._cartView = new CartView(this.container);
  },

  onUnload() {
    this._cartView.destroy();
  },
});
