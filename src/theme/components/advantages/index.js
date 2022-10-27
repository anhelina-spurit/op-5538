import { register } from '@shopify/theme-sections';
import Swiper, { Scrollbar, FreeMode } from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';
import './index.scss';

register('advantages', {
  _initSlider() {
    const element = this?.container?.querySelector('.advantages__slider');

    if (!element) return null;

    this._slider = new Swiper(element, {
      init: false,
      direction: 'horizontal',
      keyboardControl: true,
      mousewheelControl: true,
      slidesPerView: 'auto',
      spaceBetween: 0,
      initialSlide: 0,
      slidesOffsetAfter: 0,
      slidesOffsetBefore: 0,
      freeMode: true,
      scrollbar: {
        el: `.advantages__scrollbar`,
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
