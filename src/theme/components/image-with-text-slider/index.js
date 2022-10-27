import { register } from '@shopify/theme-sections';
import Swiper, { Pagination } from 'swiper';
import 'swiper/css';

import './index.scss';

const SELECTORS = {
  PAGINATION: '[data-collection-pagination]',
};

const CLASSES = {
  ACTIVE: 'active',
};

register('image-with-text-slider', {
  _initSlider() {
    const element = this.container.querySelector('.swiper');

    if (!element) return null;

    this._slider = new Swiper(element, {
      pagination: {
        el: SELECTORS.PAGINATION,
        bulletActiveClass: CLASSES.ACTIVE,
        clickable: true,
        renderBullet(index, className) {
          return `<li class="${className}"></li>`;
        },
      },
      modules: [Pagination],
    });

    return this._slider;
  },

  onLoad() {
    this._initSlider();
  },
});
