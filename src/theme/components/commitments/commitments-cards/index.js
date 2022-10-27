import Swiper, { Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';

import './index.scss';

const BREAKPOINTS = {
  md: 767,
  lg: 991,
};

export default function initCardsSlider(container) {
  const element = container.querySelector('.swiper');

  if (!element) return null;

  const slider = new Swiper(element, {
    slidesPerView: 1,
    spaceBetween: 20,
    freeMode: true,
    scrollbar: {
      el: `.commitments-cards__scrollbar`,
      draggable: true,
      dragSize: 120,
    },
    breakpoints: {
      [BREAKPOINTS.md]: {
        slidesPerView: 2,
      },
      [BREAKPOINTS.lg]: {
        slidesPerView: 3,
      },
    },
    modules: [Scrollbar],
  });

  slider.scrollbar.init();

  return slider;
}
