import { register } from '@shopify/theme-sections';

import { Tooltip } from '../tooltip';
import { ProductCard } from '../product-card';

import '../image-map';
import '../text-preview';

import './index.scss';

const SELECTORS = {
  TOOLTIP: '[data-tooltip]',
};

register('discover', {
  tooltips: [],
  onLoad() {
    this.container.querySelectorAll(SELECTORS.TOOLTIP).forEach((tooltip) => {
      this.tooltips = [...this.tooltips, new Tooltip(tooltip)];
    });
    this.productCards = new ProductCard(this?.container);
  },
  onUnload() {
    this.tooltips?.map((tooltip) => tooltip.destroy());
    this.productCards.destroy();
  },
});
