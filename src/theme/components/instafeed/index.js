import { register } from '@shopify/theme-sections';
import Swiper, { Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';

import './index.scss';

const SELECTORS = {
  INSTA_FEED: '#insta-feed',
  CONTAINER: '.instafeed-container',
  LIGHTBOX: '.instafeed-lightbox',
  MODALS: '.instafeed__modals',
  SLIDE: '.slide-page',
  SCROLLBAR: '.instafeed__scrollbar',
};

const CLASSES = {
  SLIDER_WRAPPER: 'swiper-wrapper',
  SLIDER_SLIDE: 'swiper-slide',
  SLIDER_PAGE: 'slide-page',
};

const ATTRIBUTES = {
  STYLE: 'style',
  SLIDER_PAGE: 'data-slide-page',
};

const BREAKPOINTS = {
  lg: 991,
};

register('instafeed', {
  _slider: null,
  _observer: null,
  _createSliderContainer(container, target, slides) {
    target.firstElementChild?.classList.add(CLASSES.SLIDER_WRAPPER);
    slides.forEach((slide) => {
      slide.querySelector(SELECTORS.CONTAINER).removeAttribute(ATTRIBUTES.STYLE);
      slide.classList.add(CLASSES.SLIDER_SLIDE);
      slide.classList.remove(CLASSES.SLIDER_PAGE);
      slide.removeAttribute(ATTRIBUTES.STYLE);
      slide.removeAttribute(ATTRIBUTES.SLIDER_PAGE);

      const lightbox = slide.querySelector(SELECTORS.LIGHTBOX);
      lightbox.remove();
      container.querySelector(SELECTORS.MODALS).appendChild(lightbox);
    });
  },
  _createSlider(target) {
    const slider = new Swiper(target, {
      init: false,
      direction: 'horizontal',
      keyboardControl: true,
      mousewheelControl: true,
      slidesPerView: 3,
      spaceBetween: 10,
      initialSlide: 0,
      slidesOffsetAfter: 0,
      slidesOffsetBefore: 0,
      scrollbar: {
        el: SELECTORS.SCROLLBAR,
        draggable: true,
        dragSize: 120,
      },
      breakpoints: {
        [BREAKPOINTS.lg]: {
          spaceBetween: 20,
          slidesPerView: 5,
        },
      },
      modules: [Scrollbar],
    });

    slider.init();
    slider.scrollbar.init();

    return slider;
  },

  onLoad() {
    const target = this.container.querySelector(SELECTORS.INSTA_FEED);
    const observerForInstafeed = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const slides = mutation.target.querySelectorAll(SELECTORS.SLIDE);
          if (slides.length > 0) {
            this._createSliderContainer(this.container, target, slides);
            this._slider = this._createSlider(target);
          }
        }
      }
    };

    this._observer = new MutationObserver(observerForInstafeed);
    this._observer.observe(target, {
      childList: true,
    });
  },
  onUnload() {
    this._slider.destroy();
    this._slider?.scrollbar.destroy();
    this._observer.disconnect();
  },
});
