import { register } from '@shopify/theme-sections';
import Swiper, { Scrollbar, FreeMode } from 'swiper';
import debounce from 'lodash.debounce';
import 'swiper/css';
import 'swiper/css/scrollbar';

import './index.scss';

const MEDIA_BREAKPOINTS = {
  lg: '(min-width: 992px)',
};

const DEBOUNCE_TIME = 300;

register('image-tiles', {
  mediaLg: window.matchMedia(MEDIA_BREAKPOINTS.lg),

  _initSlider() {
    const element = this.container.querySelector('.swiper');

    if (!element) return null;

    this._slider = new Swiper(element, {
      init: false,
      slidesPerView: 'auto',
      freeMode: true,
      scrollbar: {
        el: `.image-tiles__scrollbar`,
        draggable: true,
        dragSize: 120,
      },
      modules: [Scrollbar, FreeMode],
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

  _handleSlider() {
    if (this.mediaLg.matches) {
      this._destroySlider();
    } else if (!this._slider) {
      this._initSlider();
    }
  },

  onLoad() {
    this._handleSlider();
    window.addEventListener('resize', debounce(this._handleSlider.bind(this), DEBOUNCE_TIME));
  },

  onUnload() {
    this._destroySlider();
  },
});
