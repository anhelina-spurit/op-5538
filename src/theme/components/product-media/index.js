import Swiper, { Pagination } from 'swiper';
import 'swiper/css';
import './index.scss';

export function initProductMediaSlider() {
  const productMediaElement = document.querySelector('.product-media');
  const sliderElement = productMediaElement.querySelector('.product-media__slider');

  if (!sliderElement) return null;

  const slider = new Swiper(sliderElement, {
    init: true,
    autoHeight: true,
    direction: 'horizontal',
    keyboardControl: true,
    mousewheelControl: true,
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      el: '.product-media__pagination',
      clickable: true,
    },
    on: {
      init() {
        if (this.slides.length > 1) return;
        productMediaElement.classList.add('product-media--single-slide');
      },
    },
    modules: [Pagination],
  });

  slider.init();

  return slider;
}
