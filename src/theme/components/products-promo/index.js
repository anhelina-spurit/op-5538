import { register } from '@shopify/theme-sections';

import { ProductCard } from '../product-card';

import '../text-preview';
import './index.scss';

register('products-promo', {
  onLoad() {
    this._productCards = new ProductCard(this.container);
  },
  onUnload() {
    this._productCards.destroy();
  },
});
