import './index.scss';
import { Selectbox } from '../../selectbox';
import { initTabs } from '../../tabs';

const SELECTORS = {
  SELECTBOX: '.selectbox',
  TABPANEL: '[role="tabpanel"]',
  TAB: '[role="tab"]',
};

class SizeGuide {
  constructor(container = document) {
    this._container = container;
    this._init();
    this._addEventListeners();
  }

  _initTabs() {
    initTabs();
    this._container.querySelectorAll(SELECTORS.TABPANEL).forEach((tabpanel) => {
      const isSelected =
        this._container.querySelector(`[href="#${tabpanel.id}"]`).getAttribute('aria-selected') === 'true';
      if (isSelected) {
        tabpanel.removeAttribute('hidden');
      } else {
        tabpanel.hidden = true;
      }
    });
  }

  _changeActiveTab(selectedOption) {
    const panel = selectedOption.dataset.sizeGuideOption;
    const tab = this._container.querySelector(`[aria-controls="${panel}"]`);
    if (tab && tab.getAttribute('aria-selected') === 'false') {
      tab.click();
    }
  }

  _changeActiveTable(selectedOption) {
    const table = this._container.querySelector(`[data-size-guide-table-id="${selectedOption.id}"]`);
    const panel = table.closest('[role="tabpanel"]');
    const activeTable = panel.querySelector('[data-size-guide-table=""]');

    if (table) {
      if (activeTable) activeTable.dataset.sizeGuideTable = 'hidden';
      table.dataset.sizeGuideTable = '';
    }
  }

  _handleChangeSelectbox(event) {
    const selectbox = event.currentTarget;

    const selectedOption = selectbox.querySelector('[aria-selected="true"]');

    if (selectbox.dataset.select === 'size_guide_type') {
      this._changeActiveTab(selectedOption);
    } else {
      this._changeActiveTable(selectedOption);
    }
  }

  _handleChangeTab(event) {
    const tab = event.currentTarget;
    const panel = tab.getAttribute('aria-controls');
    const option = this._container.querySelector(`[data-size-guide-option="${panel}"]`);

    if (option && option.getAttribute('aria-selected') === 'false') {
      option.click();
    }
  }

  _init() {
    this._initTabs();
    this._container.querySelectorAll(SELECTORS.SELECTBOX).forEach((selectbox) => new Selectbox(selectbox));
  }

  _addEventListeners() {
    this._container.querySelectorAll(SELECTORS.SELECTBOX).forEach((selectbox) => {
      selectbox.addEventListener('change', this._handleChangeSelectbox.bind(this));
    });

    this._container.querySelectorAll(SELECTORS.TAB).forEach((tab) => {
      tab.addEventListener('click', this._handleChangeTab.bind(this));
    });
  }
}

export { SizeGuide };
