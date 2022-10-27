import './index.scss';

import debounce from 'lodash.debounce';

const SELECTORS = {
  SECTION: '#shopify-section-predictive-search',
  CONTAINER: '[data-predictive-search]',
  RESULTS: '[data-search-results]',
  STATUS: '.predictive-search-status',
  INPUT: 'input[type="search"]',
  CLOSE: '[data-close-search]',
  FORM: '.search__form',
  INPUT_LIMIT: 'input[name="limit"]',
  LIVE_REGION_COUNT: '[data-predictive-search-live-region-count]',
};

class PredictiveSearch {
  constructor(container) {
    this.container = container;
    this.input = this.container.querySelector(SELECTORS.INPUT);
    this.predictiveSearchResults = this.container.querySelector(SELECTORS.RESULTS);

    this.cachedResults = {};
    this.isOpen = false;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.container.querySelector(SELECTORS.FORM);
    form.addEventListener('submit', this.onFormSubmit.bind(this));

    this.container.addEventListener('focusout', this.onFocusOut.bind(this));
    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.input.addEventListener(
      'input',
      debounce((event) => {
        this.onChange(event);
      }, 300).bind(this),
    );
  }

  getQuery() {
    return this.input.value.trim();
  }

  onChange() {
    const searchTerm = this.getQuery();

    if (!searchTerm.length) {
      this.close(true);
      return;
    }

    this.getSearchResults(searchTerm);
  }

  onFormSubmit(event) {
    if (!this.getQuery().length) event.preventDefault();
  }

  onFocus() {
    const searchTerm = this.getQuery();

    if (!searchTerm.length) return;

    if (this.container.getAttribute('results') === 'true') {
      this.open();
    } else {
      this.getSearchResults(searchTerm);
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.container.contains(document.activeElement) || document.activeElement.matches(SELECTORS.CLOSE))
        this.close();
    });
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(' ', '-').toLowerCase();
    this.setLiveRegionLoadingState();

    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }

    let resources_limit = 4;
    const input_limit = this.container.querySelector(SELECTORS.INPUT_LIMIT);

    if (input_limit) {
      resources_limit = Number(input_limit.value);
    }

    fetch(
      `${window.theme.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&${encodeURIComponent(
        'resources[type]',
      )}=product&${encodeURIComponent('resources[limit]')}=${resources_limit}&section_id=predictive-search`,
    )
      .then((response) => {
        if (!response.ok) {
          const error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector(SELECTORS.SECTION).innerHTML;
        this.cachedResults[queryKey] = resultsMarkup;
        this.renderSearchResults(resultsMarkup);
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  setLiveRegionLoadingState() {
    this.statusElement = this.statusElement || this.container.querySelector(SELECTORS.STATUS);
    this.loadingText = this.loadingText || this.container.getAttribute('data-loading-text');

    this.setLiveRegionText(this.loadingText);
    this.container.setAttribute('loading', true);
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute('aria-hidden', 'false');
    this.statusElement.textContent = statusText;

    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', 'true');
    }, 1000);
  }

  renderSearchResults(resultsMarkup) {
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.container.setAttribute('results', true);

    this.setLiveRegionResults();
    this.open();
  }

  setLiveRegionResults() {
    this.container.removeAttribute('loading');
    this.setLiveRegionText(this.container.querySelector(SELECTORS.LIVE_REGION_COUNT).textContent);
  }

  getResultsMaxHeight() {
    this.resultsMaxHeight =
      window.innerHeight - document.getElementById('shopify-section-header').getBoundingClientRect().bottom;
    return this.resultsMaxHeight;
  }

  open() {
    this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || `${this.getResultsMaxHeight()}px`;
    this.container.setAttribute('open', true);
    this.input.setAttribute('aria-expanded', true);
    this.isOpen = true;

    this.emit('change', { isOpen: this.isOpen });
  }

  close(clearSearchTerm = false) {
    if (clearSearchTerm) {
      this.input.value = '';
      this.container.removeAttribute('results');
    }

    this.input.setAttribute('aria-activedescendant', '');
    this.container.removeAttribute('open');
    this.input.setAttribute('aria-expanded', false);
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute('style');

    this.isOpen = false;

    this.emit('change', { isOpen: this.isOpen });
  }

  emit(name = '', detail = {}) {
    this.container.dispatchEvent(
      new CustomEvent(`predictiveSearch:${name}`, {
        detail,
        bubbles: true,
      }),
    );
  }
}

function initPredictiveSearch() {
  document.querySelectorAll(SELECTORS.CONTAINER).forEach((elm) => {
    return new PredictiveSearch(elm);
  });
}

export { initPredictiveSearch };
