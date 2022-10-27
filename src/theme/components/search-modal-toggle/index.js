import './index.scss';

const SELECTORS = {
  TOGGLER: '.search-modal-toggle',
  CLOSE: '.search-modal-close',
};

const ATTRIBUTES = {
  EXPANDED: 'aria-expanded',
  CONTROLS: 'aria-controls',
  OPEN: 'data-opened',
};

class SearchModalToggle {
  constructor(container = document) {
    this.toggler = container.querySelector(SELECTORS.TOGGLER);
    this.close = container.querySelector(SELECTORS.CLOSE);
    this.modal = document.getElementById(this.toggler.getAttribute(ATTRIBUTES.CONTROLS));

    this.toggler && this.toggler.addEventListener('click', () => this.toggle());
    this.close && this.close.addEventListener('click', () => this.toggle(true));
  }

  toggle(close) {
    const expanded = close ?? this.toggler.getAttribute(ATTRIBUTES.EXPANDED) === 'true';

    this.toggler.setAttribute(ATTRIBUTES.EXPANDED, !expanded);
    expanded ? this.modal.removeAttribute(ATTRIBUTES.OPEN) : this.modal.setAttribute(ATTRIBUTES.OPEN, '');
  }
}

export { SearchModalToggle };
