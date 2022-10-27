import { register } from '@shopify/theme-sections';

import { ProductCard } from '../product-card';

register('wishlist', {
  onLoad() {
    this.productCards = new ProductCard(this.container);
  },
  onUnload() {
    this.productCards.destroy();
  },
});
