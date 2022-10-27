import Swiper, { Pagination, EffectFade } from 'swiper';

import { Listeners } from '../../utils/listeners';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './index.scss';
import { CollectionPreviewSlider } from '../collection-preview-slider';

const SELECTORS = {
  SLIDER: '[data-collections-slider]',
  SLIDE: '[data-collections-slide]',
  COLLECTION_SLIDER: '[data-collection-slider]',
  PAGINATION: '[data-collections-pagination]',
  PAGINATION_MOBILE: '[data-collections-pagination-mobile]',
  ADD_TO_CART: '[data-add-to-cart]',
};

const CLASSES = {
  ACTIVE: 'active',
};

/** Class representing a "CollectionsPreviewSlider" */
class CollectionsPreviewSlider {
  /**
   * @class CollectionsPreviewSlider
   * @name CollectionsPreviewSlider
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    this.container = container;
    this._listeners = new Listeners();
    this.sliders = [];
    this._init();
  }

  /**
   * @method destroy
   */
  destroy() {
    this.mainSlider.destroy();
    this.sliders.map((slider) => slider.destroy());
    this._listeners.removeAll();
  }

  /**
   * @method _init
   */
  _init() {
    const slides = this.container.querySelectorAll(SELECTORS.SLIDE);
    this.mainSlider = new Swiper(SELECTORS.SLIDER, {
      allowTouchMove: false,
      autoHeight: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      pagination: {
        el: SELECTORS.PAGINATION,
        bulletActiveClass: CLASSES.ACTIVE,
        clickable: true,
        renderBullet(index, className) {
          return `<li class="${className}"><span>${slides[index].dataset?.collectionsSlide}</span></li>`;
        },
      },
      modules: [Pagination, EffectFade],
    });

    this._listeners.add(this.container?.querySelector(SELECTORS.PAGINATION_MOBILE), 'change', (event) => {
      const index = event.target.selectedIndex;
      this.mainSlider.slideTo(index);
    });

    this.mainSlider.init();
    this.container.querySelectorAll(SELECTORS.COLLECTION_SLIDER).forEach((slider) => {
      this.sliders = [...this.sliders, new CollectionPreviewSlider(slider)];
    });
  }
}

export { CollectionsPreviewSlider };
