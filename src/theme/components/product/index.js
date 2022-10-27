import { register } from '@shopify/theme-sections';

import { initProductMediaSlider } from '../product-media';
import { SizeGuide } from '../size-guide/content';
import ProductForm from '../product-form';
import ProductBundle from '../product-bundle';
import '../availability';
import './index.scss';
import '../size-guide/modal/index.scss';
import '../smartwishlist';
import { Accordion } from '../accordion';
import { Modal } from '../modal';
import { Wishlist } from '../wishlist/wishlist';

const SELECTORS = {
  WISHLIST: '[data-product-wishlist]',
};

register('product', {
  _initProductMedia() {
    const productMediaElement = this.container.querySelector('.product-media');

    if (!productMediaElement) {
      this._productMedia = null;
      return;
    }

    const toggleSlider = () => {
      const isMobile = window.matchMedia('(max-width: 991px)').matches;

      if (isMobile) {
        this._productMedia = this._productMedia ?? initProductMediaSlider(productMediaElement);
      } else {
        this._productMedia?.destroy();
        this._productMedia = null;
      }
    };

    window.addEventListener('resize', toggleSlider);
    toggleSlider();
  },

  _initSizeGuide() {
    const openButtons = this.container.querySelectorAll('[data-open-size-guide]');
    if (!openButtons.length) return;
    const modal = this.container.querySelector('.size-guide-modal');
    if (!modal) return;
    this._sizeGuide = new SizeGuide(this.container);
    this._sizeGuideModal = new Modal(modal);
    openButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this._sizeGuideModal.show();
      });
    });
  },

  _initWishList() {
    this._wishlist = new Wishlist(this.container);
    this.container.querySelector(SELECTORS.WISHLIST).addEventListener('click', (event) => {
      const { target } = event;
      const wishlist = target.closest(SELECTORS.WISHLIST);
      this._wishlist.change(wishlist);
    });
  },

  onLoad() {
    if (this.container.dataset.productType === 'bundle') {
      this._productBundle = new ProductBundle(this.container);
    } else {
      this._productForm = new ProductForm(this.container);
    }

    const accordionProductInfo = this.container.querySelector('[data-product-info]');

    this._initSizeGuide();
    this._initProductMedia();
    this._initWishList();
    if (accordionProductInfo) this._accordionProductInfo = new Accordion(accordionProductInfo);
  },
});
