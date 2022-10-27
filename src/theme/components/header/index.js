import { register } from '@shopify/theme-sections';
import MmenuLigth from 'mmenu-light';

import { initPredictiveSearch } from '../predictive-search';
import { SearchModalToggle } from '../search-modal-toggle';
import { Disclosure } from '../disclosure';

import 'mmenu-light/dist/mmenu-light.css';
import './index.scss';

const CLASSES = {
  OVERLAYING: 'header--overlaying',
  BACKGROUNDED: 'header--bg',
};

const SELECTORS = {
  MENU: '#header-menu',
  MENU_ITEM: '.header__menu .menu__item',
  TOGGLER: '.header__nav-toggler',
  DISCLOSURE: '[data-disclosure]',
  SEARCH: '[data-predictive-search]',
};

const ATTRIBUTES = {
  EXPANDED: 'aria-expanded',
  CONTROLS: 'aria-controls',
  OPEN: 'data-opened',
};

let isBlockBgChange = false;

function toggleHeaderBg(element, state) {
  const method = state ? 'add' : 'remove';

  element.classList[method](CLASSES.BACKGROUNDED);
}

function handleMenuItemHover(event) {
  if (!event.target.closest(SELECTORS.MENU_ITEM) || isBlockBgChange) return;

  toggleHeaderBg(event.currentTarget, event.type === 'mouseover');
}

function handleDrawerClick(event) {
  let drawer = null;
  let expanded = false;
  const { target } = event;

  if (target.matches(SELECTORS.TOGGLER)) {
    drawer = document.getElementById(target.getAttribute(ATTRIBUTES.CONTROLS));
    expanded = target.getAttribute(ATTRIBUTES.EXPANDED) === 'true';

    target.setAttribute(ATTRIBUTES.EXPANDED, !expanded);
    toggleHeaderBg(event.currentTarget, !expanded);
  }

  if (drawer) {
    expanded ? drawer.removeAttribute(ATTRIBUTES.OPEN) : drawer.setAttribute(ATTRIBUTES.OPEN, '');
  }
}

function handleHeaderScroll(container) {
  return () => {
    isBlockBgChange = scrollY > 150;
    toggleHeaderBg(container, isBlockBgChange);
  };
}

function handleSearchChange(container) {
  return (event) => {
    isBlockBgChange = event.detail.isOpen;
    toggleHeaderBg(container, isBlockBgChange);
  };
}

register('header', {
  disclosure: [],

  onLoad() {
    this.searchToggle = new SearchModalToggle(this.container);
    initPredictiveSearch();

    this.container.addEventListener('predictiveSearch:change', handleSearchChange(this.container));

    if (this.container.classList.contains(CLASSES.OVERLAYING)) {
      this.container.addEventListener('mouseover', handleMenuItemHover);
      this.container.addEventListener('mouseout', handleMenuItemHover);
      document.addEventListener('scroll', handleHeaderScroll(this.container));
    }

    this.container.addEventListener('click', handleDrawerClick);

    const menu = new MmenuLigth(this.container.querySelector(SELECTORS.MENU), '(max-width: 992px)');

    menu.navigation({ title: '' });

    this.container.querySelectorAll(SELECTORS.DISCLOSURE).forEach((item) => {
      this.disclosure = [...this.disclosure, new Disclosure(item)];
    });
  },

  onUnload() {
    this.disclosure?.map((disclosure) => disclosure.destroy());
  },
});
