import { register } from '@shopify/theme-sections';
import Swiper, { Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';

import './index.scss';

const BREAKPOINTS = {
  md: 767,
  lg: 991,
  xl: 1220,
};

register('products-discover', {
  _initSlider() {
    const element = this.container.querySelector('.swiper');

    if (!element) return null;

    this._slider = new Swiper(element, {
      init: false,
      direction: 'horizontal',
      keyboardControl: true,
      mousewheelControl: true,
      slidesPerView: 2,
      spaceBetween: 20,
      initialSlide: 0,
      slidesOffsetAfter: 0,
      slidesOffsetBefore: 0,
      scrollbar: {
        el: `.products-discover__scrollbar`,
        draggable: true,
        dragSize: 120,
      },
      breakpoints: {
        [BREAKPOINTS.xl]: {
          slidesPerView: 5,
        },
        [BREAKPOINTS.lg]: {
          slidesPerView: 4,
        },
        [BREAKPOINTS.md]: {
          slidesPerView: 3,
        },
      },
      modules: [Scrollbar],
    });

    this._slider.init();
    this._slider.scrollbar.init();
    return this._slider;
  },

  _destroySlider() {
    this._slider?.destroy();
    this._slider = null;
    this._slider?.scrollbar.destroy();
  },

  onBlockSelect(event) {
    this._slider?.slideTo(event.target.dataset.index);
  },

  onLoad() {
    this._initSlider();
  },

  onUnload() {
    this._destroySlider();
  },
});
