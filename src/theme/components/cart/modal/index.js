import MmenuLight from 'mmenu-light';
import 'mmenu-light/dist/mmenu-light.css';

import Cart from '../cart';
import { CartView } from '../form';
import { ElementsEventReducer } from '../../../utils/elements-event-reducer';
import { RecentlyViewedProducts } from '../../recently-viewed-products/products';
import { initProductSlider } from '../../product-slider';
import { CartNotice } from '../notice';

import './index.scss';

const SELECTORS = {
  MODAL: '[data-cart-modal]',
  CLOSE: '[data-cart-modal-close]',
  NOTICE: '[data-cart-modal-notice]',
};

/** Class representing a "modal Cart" */
class CartModal {
  /**
   * @class CartModal
   * @name CartModal
   *
   * @constructor
   * */
  constructor() {
    this._cart = new Cart();
    this._cartView = new CartView();
    this._cartNotice = new CartNotice();
    this._recentlyProducts = new RecentlyViewedProducts(document.querySelector(SELECTORS.MODAL), () => {
      initProductSlider({
        // eslint-disable-next-line @shopify/no-useless-computed-properties
        [767]: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      });
    });
    this._elementsEventReducer = new ElementsEventReducer(document, {
      click: {
        [SELECTORS.CLOSE]: () => this.close(),
      },
    });
    this._open = this.open.bind(this);
    this._cart.on('cart:change', (response) => {
      this.renderNotice(response);
      this._open();
      this.renderVP();
    });
    this._initModal();
  }

  /**
   * @method open
   */
  open() {
    this._drawer.open();
  }

  /**
   * @method close
   */
  close() {
    this._drawer.close();
  }

  /**
   * @method destroy
   */
  destroy() {
    this._elementsEventReducer.destroy();
    this._drawer.destroy();
    this._cartView.destroy();
  }

  /**
   * @method renderNotice
   */
  renderNotice(response) {
    const noticeElement = document.querySelector(SELECTORS.NOTICE);

    if (noticeElement) {
      this._cartNotice.destroy();
      if (response?.type === 'error') {
        this._cartNotice.createNotice({
          heading: response.messages,
          mode: response?.type,
        });
      } else {
        this._cartNotice.setResponse(response);
      }
      noticeElement.append(this._cartNotice.render());
    }
  }

  /**
   * @method renderVP
   */
  renderVP() {
    document.dispatchEvent(new Event('vp-rerender'));
  }

  /**
   * @method _initModal
   */
  _initModal() {
    const modalElement = document.querySelector(SELECTORS.MODAL);
    if (modalElement) {
      const modal = new MmenuLight(modalElement);
      modal.offcanvas({
        position: 'right',
      });
      this._drawer = modal.offcanvas(undefined);
      modalElement.classList.remove('hidden');
    }
  }
}

export { CartModal };
