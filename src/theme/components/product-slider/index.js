import Swiper, { Scrollbar } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './index.scss';

const BREAKPOINTS = {
  md: 767,
  lg: 991,
};

export function initProductSlider(breakpoints) {
  const elements = document.querySelectorAll('.product-slider');
  let breakpointsConfig = {
    [BREAKPOINTS.md]: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  };

  if (breakpoints) {
    breakpointsConfig = breakpoints;
  }

  if (!elements) return null;
  const sliders = Array.from(elements).map((element) => {
    if (!element) return null;

    const slider = new Swiper(element, {
      init: false,
      direction: 'horizontal',
      keyboardControl: true,
      mousewheelControl: true,
      slidesPerView: 2,
      spaceBetween: 12,
      initialSlide: 0,
      slidesOffsetAfter: 0,
      slidesOffsetBefore: 0,
      scrollbar: {
        el: `.product-slider__scrollbar`,
        draggable: true,
        dragSize: 120,
      },
      breakpoints: breakpointsConfig,
      modules: [Scrollbar],
    });

    slider.init();
    slider.scrollbar.init();
    return slider;
  });
  return sliders;
}
