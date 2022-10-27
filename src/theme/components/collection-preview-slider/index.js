import Swiper, { Pagination } from 'swiper';

import { Listeners } from '../../utils/listeners';
import 'swiper/css';
import '../dot';
import './index.scss';
import '../collection-preview-products';

const SELECTORS = {
  COLLECTIONS_SLIDE: '[data-collections-slide]',
  COLLECTION_SLIDER: '[data-collection-slider]',
  DOT: '[data-dot]',
  PRODUCT: '[data-product]',
  PRODUCT_SIMPLE: '[data-product-simple]',
  PAGINATION: '[data-collection-pagination]',
  MODAL_CONTENT: '[data-collection-slider-modal-content]',
};

const CLASSES = {
  ACTIVE: 'active',
};

/** Class representing a "CollectionPreviewSlider" */
class CollectionPreviewSlider {
  /**
   * @class CollectionPreviewSlider
   * @name CollectionPreviewSlider
   *
   * @constructor
   * @param slide {HTMLElement|Element|Node|Object}
   * */
  constructor(slide) {
    if (!slide) return;
    this.slide = slide;
    this._modalContent = document.querySelector(SELECTORS.MODAL_CONTENT);
    this._listeners = new Listeners();
    this._initSliders();
    this._initSimpleProducts();
    this._setActiveElem();
    this._setListeners();
  }

  /**
   * @method destroy
   */
  destroy() {
    this.slider.destroy();
    this._listeners.removeAll();
  }

  /**
   * @method _select
   *  @param event {Event}
   */
  _select(event) {
    const { currentTarget } = event;
    const id = currentTarget.dataset.dot;
    const id_product_simple = `${currentTarget.dataset.dot}_simple`;
    const products = currentTarget.closest(SELECTORS.COLLECTIONS_SLIDE).querySelectorAll(SELECTORS.PRODUCT);
    const simple_products = document.querySelectorAll(SELECTORS.PRODUCT_SIMPLE);
    const dots = currentTarget.closest(SELECTORS.COLLECTIONS_SLIDE).querySelectorAll(SELECTORS.DOT);
    products.forEach((product) => {
      product.id === id ? product.classList.add(CLASSES.ACTIVE) : product.classList.remove(CLASSES.ACTIVE);
    });

    simple_products.forEach((product) => {
      product.id === id_product_simple
        ? product.classList.add(CLASSES.ACTIVE)
        : product.classList.remove(CLASSES.ACTIVE);
      window.innerWidth <= 768 && document.dispatchEvent(new Event('dot:click'));
    });
    dots.forEach((dot) => {
      dot === currentTarget ? dot.classList.add(CLASSES.ACTIVE) : dot.classList.remove(CLASSES.ACTIVE);
    });
  }

  /**
   * @method _setListeners
   */
  _setListeners() {
    this.slide.querySelectorAll(SELECTORS.DOT).forEach((dot) => {
      this._listeners.add(dot, 'click', this._select.bind(this));
    });
  }

  /**
   * @method _setActiveElem
   */
  _setActiveElem() {
    this.slide?.closest(SELECTORS.COLLECTIONS_SLIDE).querySelector(SELECTORS.PRODUCT)?.classList.add(CLASSES.ACTIVE);
    this.slide?.querySelector(SELECTORS.DOT)?.classList.add(CLASSES.ACTIVE);
    window.dispatchEvent(new Event('resize'));
  }

  /**
   * @method _initSliders
   */
  _initSliders() {
    this.slider = new Swiper(this.slide, {
      pagination: {
        el: SELECTORS.PAGINATION,
        bulletActiveClass: CLASSES.ACTIVE,
        clickable: true,
        renderBullet(index, className) {
          return `<li class="${className}"></li>`;
        },
      },
      modules: [Pagination],
    });

    this.slider.init();
  }

  /**
   * @method _initSimpleProducts
   */
  _initSimpleProducts() {
    const simple_products = this.slide.nextElementSibling.querySelectorAll(SELECTORS.PRODUCT_SIMPLE);
    simple_products.forEach((product) => {
      const dupNode = product.cloneNode(true);
      this._modalContent.appendChild(dupNode);
      product.remove();
    });
  }
}

export { CollectionPreviewSlider };
