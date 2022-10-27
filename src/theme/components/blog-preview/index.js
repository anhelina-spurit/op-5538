import { register } from '@shopify/theme-sections';
import Swiper, { Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';
import './index.scss';

const BREAKPOINTS = {
  md: 767,
  lg: 991,
};

register('blog-preview', {
  _initSlider() {
    const element = this?.container?.querySelector('.swiper');

    if (!element) return null;

    this._slider = new Swiper(element, {
      init: false,
      direction: 'horizontal',
      keyboardControl: true,
      mousewheelControl: true,
      slidesPerView: 1,
      spaceBetween: 20,
      initialSlide: 0,
      slidesOffsetAfter: 0,
      slidesOffsetBefore: 0,
      scrollbar: {
        el: `.blog-preview__scrollbar`,
        draggable: true,
        dragSize: 120,
      },
      breakpoints: {
        [BREAKPOINTS.lg]: {
          slidesPerView: 3,
        },
        [BREAKPOINTS.md]: {
          slidesPerView: 2,
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
