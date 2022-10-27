import { register } from '@shopify/theme-sections';
import Swiper, { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';

register('nosto-recommendations', {
  _initSlider() {
    const element = this?.container?.querySelector('.nosto-slider__slider');
    const nostoSection = this._nostoSectionId ? this?.container?.querySelector(`#${this._nostoSectionId}`) : null;

    if (!element || !nostoSection) return null;

    this._slider = new Swiper(element, {
      init: true,
      direction: 'horizontal',
      spaceBetween: 25,
      navigation: {
        nextEl: element.querySelector('.swiper-button-next'),
        prevEl: element.querySelector('.swiper-button-prev'),
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        767: {
          slidesPerView: 3,
        },
        1200: {
          slidesPerView: 4,
        },
      },
      modules: [Navigation],
    });

    return this._slider;
  },

  _destroySlider() {
    this._slider?.destroy();
    this._slider = null;
  },

  onBlockSelect(event) {
    this._slider?.slideTo(event.target.dataset.index);
  },

  onLoad() {
    document.addEventListener('nosto-slider-iframe-loaded', (evt) => {
      this._nostoSectionId = evt.detail.nostoSectionId;
      this._initSlider();
    });
  },

  onUnload() {
    this._destroySlider();
  },
});
