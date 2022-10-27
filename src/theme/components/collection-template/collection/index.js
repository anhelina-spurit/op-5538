import { Filter } from '../../filter';
import { Sort } from '../../sort';
import { Sidebar } from '../sidebar';
import { templateAPI } from '../../../api/shopify/template';
import { ElementsEventReducer } from '../../../utils/elements-event-reducer';
import { preventDefault } from '../../../utils/prevent-default';
import { ProductCard } from '../../product-card';

import '../../product-list';
import '../../load-more';

const SELECTORS = {
  SORT: '.sort',
  PAGE: '[data-collection-page]',
  RESULTS: '[data-results]',
  ACTIVE_FILTERS: '[data-filter-active]',
  FILTER_COUNT: '[data-filter-count]',
  FILTER_RESET: '[data-filter-reset]',
  LOAD_MORE: '[data-load-more]',
  LOAD_MORE_BUTTON: '[data-load-more-button]',
  PRODUCT_LIST: '[data-product-list]',
  PRODUCT_LIST_ITEM: '[data-product-list-item]',
  ALLOW_INFINITE_SCROLL: '[data-allow-infinite-scroll]',
  PAGE_LOADER_TRIGGER: '.page-loader-trigger',
  LOADER: '.load-more .loader',
  PAGE_ATTRIBUTE: '[data-page]',
  PRODUCT_COUNT: '.collection__product-number',
};

const DATA_ATTRIBUTES = {
  URL: 'data-collection-url',
  INITIAL_PAGE: 'data-collection-initial-page',
};

const CLASSES = {
  HIDDEN: 'hidden',
};

/** Class representing a "Collection" */
class Collection {
  /**
   * @class Collection
   * @name Collection
   *
   * @constructor
   * @param container {HTMLElement|Element|Node|Object}
   * */
  constructor(container = document) {
    this._container = container;
    this._collectionUrl = this._container.getAttribute(DATA_ATTRIBUTES.URL);
    this._currentPage = Number.parseInt(
      this._container.querySelector(`[${DATA_ATTRIBUTES.INITIAL_PAGE}]`).getAttribute(DATA_ATTRIBUTES.INITIAL_PAGE),
      10,
    );

    this._productCards = new ProductCard(this._container);
    this._sort = new Sort(this._container.querySelector(SELECTORS.SORT));
    this._filter = new Filter();
    this._sidebar = new Sidebar(document, this._filter);
    this._allowInfiniteScroll =
      this._container.querySelector(SELECTORS.ALLOW_INFINITE_SCROLL)?.dataset?.allowInfiniteScroll === 'true';

    this._watchGridScroll = this._watchGridScroll.bind(this);
    this._handleIntersection = this._handleIntersection.bind(this);
    this._initEventListeners();

    const numberListItems = container.querySelectorAll(SELECTORS.PRODUCT_LIST_ITEM).length;
    this._container.querySelector(SELECTORS.PRODUCT_COUNT).innerHTML =
      numberListItems === 1
        ? `${numberListItems} ${window.collection.one_product}`
        : `${numberListItems} ${window.collection.products}`;
  }

  /**
   *
   * @method load
   * @param filterParams {Object}
   * @param sortType {string}
   * @param page {Number}
   * @param append {boolean}
   */
  load(filterParams, sortType, page = 1, append = false) {
    const baseUrl = new URL(this._collectionUrl, window.location.origin);
    const historyUrl = this._createUrlWithParams(baseUrl, filterParams, sortType);
    const requestUrl = new URL(historyUrl);

    requestUrl.searchParams.append('page', String(page));
    requestUrl.searchParams.append('view', 'ajax');

    templateAPI
      .get(requestUrl)
      .then((html) => {
        this._render(html, append);
        history.pushState(null, null, historyUrl);
        this._currentPage = page;
        // Reload swatches
        document.dispatchEvent(new Event('cs-rerender'));
        // Reload VPs
        document.dispatchEvent(new Event('vp-rerender'));
      })
      .catch(console.error); // eslint-disable-line no-console
  }

  /**
   * @method destroy
   */
  destroy() {
    this._filter.destroy();
    this._sort.destroy();
    this._sidebar.destroy();
    this._reducer.destroy();
    this._productCards.destroy();
  }

  /**
   *
   * @method _render
   * @param html {string}
   * @param append {boolean}
   */
  _render(html, append) {
    const resultsDOM = new DOMParser().parseFromString(html, 'text/html');
    const newProducts = resultsDOM.querySelectorAll(SELECTORS.PRODUCT_LIST_ITEM);
    const newProductsList = resultsDOM.querySelector(SELECTORS.PRODUCT_LIST);
    const newActiveFilters = resultsDOM.querySelector(SELECTORS.ACTIVE_FILTERS);
    const newFilterCount = newActiveFilters?.querySelector(SELECTORS.FILTER_COUNT).value;
    const newLoadMore = resultsDOM.querySelector(SELECTORS.LOAD_MORE);
    const loader = resultsDOM.querySelector(SELECTORS.LOADER);
    if (this._allowInfiniteScroll) {
      for (let i = 0; (i < newLoadMore?.children?.length) | 0; i++) {
        if (!newLoadMore.children[i]) {
          continue;
        }
        newLoadMore.children[i].style.display = 'none';
      }
      const triggerLoaderDiv = resultsDOM.querySelector(SELECTORS.PAGE_LOADER_TRIGGER);
      if (triggerLoaderDiv && loader) {
        loader.style.display = 'block';
        triggerLoaderDiv.style.display = 'block';
      }
    }

    const results = this._container.querySelector(SELECTORS.RESULTS);
    const productList = this._container.querySelector(SELECTORS.PRODUCT_LIST);
    const activeFilters = this._container.querySelector(SELECTORS.ACTIVE_FILTERS);
    const loadMore = this._container.querySelector(SELECTORS.LOAD_MORE);

    const filterReset = this._container.querySelector(SELECTORS.FILTER_RESET);

    if (filterReset) {
      filterReset.classList[parseInt(newFilterCount, 10) <= 0 ? 'add' : 'remove'](CLASSES.HIDDEN);
    }

    append
      ? newProducts.forEach((product) => productList.insertAdjacentElement('beforeend', product))
      : productList?.replaceWith(newProductsList);
    activeFilters?.replaceWith(newActiveFilters);
    if (newLoadMore) {
      loadMore ? loadMore.replaceWith(newLoadMore) : results.append(newLoadMore);
      if (this._allowInfiniteScroll) {
        loader.style.display = 'none';
        this._watchGridScroll();
      }
    } else {
      loadMore?.remove();
    }

    const numberListItems = this._container.querySelectorAll(SELECTORS.PRODUCT_LIST_ITEM).length;
    this._container.querySelector(SELECTORS.PRODUCT_COUNT).innerHTML =
      numberListItems === 1
        ? `${numberListItems} ${window.collection.one_product}`
        : `${numberListItems} ${window.collection.products}`;

    typeof window?.SmartWishlistMain === 'function' && window?.SmartWishlistMain();
  }

  /**
   *
   * @method _createUrlWithParams
   * @param baseUrl {URL}
   * @param filterParams {Object}
   * @param sortType {String}
   */
  _createUrlWithParams(baseUrl, filterParams, sortType) {
    const urlWithParams = new URL(baseUrl.toString());

    if (filterParams) {
      Object.keys(filterParams).forEach((key) => {
        if (typeof filterParams[key] === 'object') {
          Array.isArray(filterParams[key])
            ? filterParams[key].flat(3).forEach((value) => value && urlWithParams.searchParams.append(key, value))
            : Object.entries(filterParams[key]).forEach(([subkey, val]) => {
                urlWithParams.searchParams.append(`${key}[${subkey}]`, val);
              });
        } else {
          filterParams[key] && urlWithParams.searchParams.append(key, filterParams[key]);
        }
      });
    }

    if (sortType) {
      urlWithParams.searchParams.append('sort_by', sortType);
    }

    return urlWithParams;
  }

  /**
   * @method _setListeners
   */

  /**
   * @method _handleIntersect
   * @private
   */
  _handleIntersection(observedElements) {
    observedElements?.forEach((el) => {
      if (el.isIntersecting) {
        const loader = this._container.querySelector(SELECTORS.LOADER);
        loader.style.display = 'block';
        this.load(this._filter.getParams(), this._sort.getType(), this._currentPage + 1, true);
      }
    });
  }

  /**
   * @method _watchGridScroll
   * @private
   */
  _watchGridScroll() {
    const options = {
      threshold: 1,
    };
    const loadTrigger = this._container.querySelector(SELECTORS.PAGE_LOADER_TRIGGER);
    const observer = new IntersectionObserver(this._handleIntersection, options);
    if (loadTrigger) {
      observer.observe(loadTrigger);
    }
  }

  _initEventListeners() {
    this._reducer = new ElementsEventReducer(this._container.querySelector(SELECTORS.RESULTS), {
      click: {
        [SELECTORS.LOAD_MORE_BUTTON]: preventDefault(() => {
          this.load(this._filter.getParams(), this._sort.getType(), this._currentPage + 1, true);
        }),
      },
    });
    this._filter.on('filter', (filterParams) => this.load(filterParams, this._sort.getType()));
    this._sort.on('sort', (sortType) => this.load(this._filter.getParams(), sortType));
    if (this._allowInfiniteScroll) {
      this._watchGridScroll();
    }
  }
}

export { Collection };
