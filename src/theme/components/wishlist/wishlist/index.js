import { wishlistAPI } from '../../../api/shopify/wishlist';
import { templateAPI } from '../../../api/shopify/template';
import { getCookie } from '../../../utils/cookie';

import './index.scss';
import '../load-more/index.scss';

const SELECTORS = {
  WISHLIST: '[data-wishlist]',
  EMPTY: '[data-wishlist-empty]',
  LOAD_MORE: '[data-load-more]',
  LOAD_MORE_BUTTON: '[data-load-more-button]',
  PRODUCT_LIST: '[data-product-list]',
  PRODUCT_LIST_ITEM: '[data-product-list-item]',
  PRODUCT: '[data-product]',
  VARIANT: '[data-variant]',
  COUNT: '[data-wishlist-count]',
};

const DATA_ATTRIBUTES = {
  CUSTOMER_ID: 'data-customer-id',
};

class Wishlist {
  /**
   * @class Collection
   * @name Collection
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    this._container = container;
    this.wishlistProducts = this._container.querySelector(SELECTORS.WISHLIST);
    this.customerId = this.wishlistProducts?.getAttribute(DATA_ATTRIBUTES.CUSTOMER_ID);
    this.count = this._container.querySelector(SELECTORS.COUNT);
    this._searchUrl = theme.routes.search_url;
    this.url = null;
    if (this.customerId) {
      this.url = `/a/wishlist?type=api&customerid=${this.customerId}&version=1`;
    }
    this._currentPage = 1;
    // this._reducer = new ElementsEventReducer(this._container, {
    //   click: {
    //     [SELECTORS.LOAD_MORE_BUTTON]: preventDefault(() => {
    //       console.log('LOAD 2');
    //       this._getWishListData(this._currentPage + 1, true);
    //     }),
    //   },
    // });
    this._getWishListData();
  }

  /**
   * @method change
   */
  change(item) {
    const wishlist_app_icon = item.querySelector('.smartwishlist');
    const productId = Number(item.querySelector(SELECTORS.PRODUCT).dataset.product);
    const variantId = Number(item.querySelector(SELECTORS.VARIANT).dataset.variant);
    if (wishlist_app_icon.classList.contains('unbookmarked')) {
      this._add(productId, variantId);
    } else {
      this._remove(productId, variantId);
      setTimeout(() => {
        this._getWishListData();
      }, 500);
    }
  }

  /**
   * @method renderVP
   */
  renderVP() {
    document.dispatchEvent(new Event('vp-rerender'));
  }

  /**
   * @method destroy
   */
  destroy() {
    this._reducer.destroy();
  }

  /**
   * @method _add
   * @param product_id {number}
   * @param variant_id {number}
   */
  _add(product_id, variant_id) {
    window.AddToSmartWishlist(product_id, variant_id);
    document.dispatchEvent(
      new CustomEvent('wishlist:add', {
        detail: {
          productId: product_id,
          variantId: variant_id,
        },
      }),
    );
  }

  /**
   * @method _remove
   * @param product_id {number}
   * @param variant_id {number}
   */
  _remove(product_id, variant_id) {
    window.RemoveFromSmartWishlist(product_id, variant_id);
    document.dispatchEvent(
      new CustomEvent('wishlist:remove', {
        detail: {
          productId: product_id,
          variantId: variant_id,
        },
      }),
    );
  }

  /**
   * @method _render
   * @param html {HTMLElement|Element}
   */
  _render(html) {
    this.wishlistProducts ? (this.wishlistProducts.innerHTML = html) : null;
    typeof window?.SmartWishlistMain === 'function' && window?.SmartWishlistMain();
  }

  /**
   * @method _insert
   * @param html {HTMLElement|Element}
   */
  _insert(html) {
    const resultsDOM = new DOMParser().parseFromString(html, 'text/html');
    const newProducts = resultsDOM.querySelectorAll(SELECTORS.PRODUCT_LIST_ITEM);
    const newLoadMore = resultsDOM.querySelector(SELECTORS.LOAD_MORE);
    const productList = this._container.querySelector(SELECTORS.PRODUCT_LIST);
    const loadMore = this._container.querySelector(SELECTORS.LOAD_MORE);

    newProducts.forEach((product) => productList.insertAdjacentElement('beforeend', product));
    newLoadMore ? loadMore?.replaceWith(newLoadMore) : loadMore?.remove();
    typeof window?.SmartWishlistMain === 'function' && window?.SmartWishlistMain();
  }

  /**
   * @method _getWishListData
   */
  _getWishListData(page = 1, append = false) {
    if (!this.wishlistProducts) return;
    if (!this.url) {
      const data = JSON.parse(getCookie('bookmarkeditems'));
      const query = data?.items.map((item) => `id:${item[0]}`).join(' OR ');
      this._getWishListProducts(query, page, append);
      this._currentPage = page;
      this.renderVP();
      this._setCount(data.items.length);
      return;
    }
    wishlistAPI
      .get(this.url)
      .then((res) => {
        const query = res?.items.map((item) => `id:${item.id}`).join(' OR ');
        this._getWishListProducts(query, page, append);
        this._currentPage = page;
        this.renderVP();
        this._setCount(res.items.length);
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }

  /**
   * @method _getWishListProducts
   * @param query {string}
   * @param page
   * @param append
   */
  _getWishListProducts(query, page, append) {
    templateAPI
      .get(`${this._searchUrl}?view=wishlist&type=product&q=${query}&page=${page}`)
      .then((res) => (append ? this._insert(res) : this._render(res)))
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }

  /**
   * @method _setCount
   */
  _setCount(count) {
    if (!count || count <= 0) {
      this.count.setAttribute('hidden', 'hidden');
      return;
    }
    this.count.querySelector('span').innerHTML = count;
    this.count.removeAttribute('hidden');
  }
}

export { Wishlist };
