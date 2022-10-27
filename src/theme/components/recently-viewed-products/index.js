import { register } from '@shopify/theme-sections';

import { initProductSlider } from '../product-slider';

import { RecentlyViewedProducts } from './products';

import './index.scss';

register('recently-viewed-products', {
  _recentlyProducts: null,
  onLoad() {
    this._recentlyProducts = new RecentlyViewedProducts(this.container, () => {
      initProductSlider();
    });
  },
  onUnload() {
    this._recentlyProducts.destroy();
  },
});
