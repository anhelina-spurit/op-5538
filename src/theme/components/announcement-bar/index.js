import { register } from '@shopify/theme-sections';
import Swiper, { Autoplay } from 'swiper';

import 'swiper/css';
import './index.scss';

const SELECTORS = {
  SLIDER: '.announcement-slider',
  SLIDE: '.swiper-slide',
  CLOSE: '.announcement-bar__close',
};

const SLIDE_DELAY = 3500;

function getMaxHeight(elements) {
  let maxHeight = 0;

  elements.forEach((element) => {
    maxHeight = element.clientHeight > maxHeight ? element.clientHeight : maxHeight;
  });

  return maxHeight;
}

function setHeight(element, height) {
  element.style.height = `${height}px`;
}

register('announcement-bar', {
  onLoad() {
    const slider = this.container.querySelector(SELECTORS.SLIDER);
    const slides = slider.querySelectorAll(SELECTORS.SLIDE);
    const close = this.container.querySelector(SELECTORS.CLOSE);

    if (close) {
      close.addEventListener('click', () => {
        sessionStorage.setItem('wasAnnouncementBarShown', 'true');
        this.container.remove();
      });
    }

    if (slides.length <= 1) return null;

    setHeight(slider, getMaxHeight(slides));

    return new Swiper(slider, {
      direction: 'vertical',
      autoHeight: true,
      loop: true,
      autoplay: {
        delay: SLIDE_DELAY,
      },
      modules: [Autoplay],
    });
  },
});
