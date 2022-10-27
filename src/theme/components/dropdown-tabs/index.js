import DropdownButton from './dropdownbutton';

import './index.scss';

const SELECTORS = {
  BLOCK: '[data-dropdown-tabs]',
  TAB: '[role=tab]',
};

const CLASSES = {
  OPENED: 'dropdown-tabs--opened',
};

class DropdownTabs {
  constructor(container) {
    this.block = container.querySelector(SELECTORS.BLOCK);
    this.tabs = container.querySelectorAll(SELECTORS.TAB);
    this.panels = [];
    this.activeIndex = 0;

    if (this.block) this.init();
  }

  init() {
    this.tabs.forEach((tab, i) => {
      if (tab.getAttribute('aria-selected') === true) {
        this.activeIndex = i;
      }

      this.panels.push(document.getElementById(tab.getAttribute('aria-controls')));
      tab.addEventListener('click', this.changeTab.bind(this));
    });

    this.dropdown = new DropdownButton({ text: this.tabs[this.activeIndex]?.textContent, tabSelector: SELECTORS.TAB });
    this.block.insertAdjacentElement('afterbegin', this.dropdown.element);
    this.dropdown.element.addEventListener('dropdown:expand', (event) => this.toggleExpand(event.detail.expanded));
  }

  /**
   * @param {Boolean} state
   */
  toggleExpand(state) {
    const method = state ? 'add' : 'remove';
    this.block.classList[method](CLASSES.OPENED);
  }

  /**
   * @param {Event} event click
   */
  changeTab(event) {
    event.preventDefault();
    this.dropdown.toggleState(false);

    this.activeIndex = [...this.tabs].indexOf(event.target);

    if (this.activeIndex >= 0) {
      this.setActiveTab(this.activeIndex);
      this.setActivePanel(this.activeIndex);
      this.dropdown.textContent = this.tabs[this.activeIndex]?.textContent;
    }
  }

  /**
   * @param {Number} index
   */
  setActivePanel(index) {
    this.panels.forEach((panel, i) => {
      index === i ? panel.removeAttribute('hidden') : panel.setAttribute('hidden', '');
    });
  }

  /**
   * @param {Number} index
   */
  setActiveTab(index) {
    this.tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', index === i);
    });
  }
}

export default DropdownTabs;
