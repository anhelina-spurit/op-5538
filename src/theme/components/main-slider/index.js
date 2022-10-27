import { register } from '@shopify/theme-sections';
import Swiper, { Autoplay, Pagination } from 'swiper';

import VideoBlock from '../video';
import { CountDown } from '../countDown';

import 'swiper/css';
import 'swiper/css/scrollbar';
import './index.scss';

const SELECTORS = {
  COUNTER_WRAPPER: '[data-slider-counter-wrapper]',
  COUNTER: '[data-slider-counter]',
  VIDEO: '[data-video-settings]',
};

const ATTRIBUTES = {
  CONFIG: 'data-slider-counter-config',
};

const CLASSES = {
  ACTIVE: 'main-slider__counter--active',
};

register('main-slider', {
  counters: [],
  _initSlider() {
    const element = this?.container?.querySelector('.main-slider__slider');

    if (!element) return null;

    this._slider = new Swiper(element, {
      init: true,
      direction: 'horizontal',
      keyboardControl: true,
      mousewheelControl: true,
      slidesPerView: 1,
      spaceBetween: 0,
      autoplay: {
        delay: 5000,
      },
      pagination: {
        el: `.main-slider__pagination`,
      },
      modules: [Autoplay, Pagination],
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
    this._initSlider();
    const videos = this.container.querySelectorAll(SELECTORS.VIDEO);
    if (videos) {
      videos.forEach((video) => {
        this._video = new VideoBlock({
          video,
        });
      });
    }

    this.container.querySelectorAll(SELECTORS.COUNTER_WRAPPER).forEach((item) => {
      const { start, end } = JSON.parse(item.getAttribute(ATTRIBUTES.CONFIG));

      if (!start || !end) return;

      const onRender = (time) => {
        const days = time.days < 10 ? `0${time.days}` : time.days;
        const hours = time.hours < 10 ? `0${time.hours}` : time.hours;
        const minutes = time.minutes < 10 ? `0${time.minutes}` : time.minutes;
        const seconds = time.seconds < 10 ? `0${time.seconds}` : time.seconds;
        item.querySelector(SELECTORS.COUNTER).innerHTML = `${days}:${hours}:${minutes}:${seconds}`;
        item.classList.add(CLASSES.ACTIVE);
      };

      const onComplete = () => {
        item.classList.remove(CLASSES.ACTIVE);
      };

      const onWait = (startTime, finishTime) => {
        const message = window.countDown.period;
        item.querySelector(SELECTORS.COUNTER).innerHTML = message
          .replace('{{ date_start }}', new Date(startTime).getDate())
          .replace('{{ date_end }}', new Date(finishTime).getDate());
        item.classList.add(CLASSES.ACTIVE);
      };

      this.counters = [...this.counters, new CountDown(start, end, onRender, onComplete, onWait)];
    });
  },

  onUnload() {
    this._destroySlider();
    this.counters?.forEach((counter) => {
      counter?.destroy();
    });
  },
});
