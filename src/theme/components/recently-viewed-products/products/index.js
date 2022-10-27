import { templateAPI } from '../../../api/shopify/template';
import { ProductCard } from '../../product-card';

const SELECTORS = {
  PRODUCTS: '[data-recently-viewed-products]',
};

/** Class representing a "Recently products" */
class RecentlyViewedProducts {
  /**
   * @class RecentlyViewedProducts
   * @name RecentlyViewedProducts
   *
   * @constructor
   * */
  constructor(container = document, afterRenderCallback = null) {
    this._container = container;
    this._recentlyViewedProducts = this._container.querySelector(SELECTORS.PRODUCTS);
    this._afterRenderCallback = afterRenderCallback;
    this._searchUrl = theme.routes.search_url;
    this._initRecentlyViewedProducts();
  }

  /**
   * @method destroy
   */
  destroy() {
    this._productCards.destroy();
  }

  /**
   * @method _render
   */
  _render(html) {
    this._recentlyViewedProducts ? (this._recentlyViewedProducts.innerHTML = html) : null;
    this._initProductsCard();
    typeof window?.SmartWishlistMain === 'function' && window?.SmartWishlistMain();
    if (this._afterRenderCallback && typeof this._afterRenderCallback === 'function') {
      this._afterRenderCallback();
    }
  }

  _initProductsCard() {
    this._productCards = new ProductCard(this._recentlyViewedProducts);
  }

  /**
   * @method _getRecentlyViewedProductsSearchQuery
   * return string
   */
  _getRecentlyViewedProductsSearchQuery(recentlyViewedProducts) {
    const query = recentlyViewedProducts.map((item) => `id:${item}`).join(' OR ');
    return `${this._searchUrl}?view=recently-viewed-products&type=product&q=${query}`;
  }

  /**
   * @method _initRecentlyViewedProducts
   */
  _initRecentlyViewedProducts() {
    const recentlyViewedProducts = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
    if (recentlyViewedProducts.length === 0) {
      return;
    }
    const searchQuery = this._getRecentlyViewedProductsSearchQuery(recentlyViewedProducts);

    templateAPI
      .get(searchQuery)
      .then((res) => this._render(res))
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error));
  }
}

export { RecentlyViewedProducts };
