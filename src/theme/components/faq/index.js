import { register } from '@shopify/theme-sections';
import debounce from 'lodash.debounce';

import { Accordion } from '../accordion';
import './index.scss';

const BREAKPOINT = 991;
const SELECTORS = {
  mobileAccordion: '[data-main-faq-accordion]',
  accordion: '[data-faq-accordion]',
  mobileAccordionItem: '.faq__accordion-item--main',
  accordionItemTitle: '.accordion-item__title',
  accordionItemButton: '.accordion-item__button',
  accordionItemPanel: '.accordion-item__panel',
};

register('faq', {
  _initMobileAccordion() {
    this._mobileAccordions = Array.from(this?.container?.querySelectorAll(SELECTORS.mobileAccordion)).map(
      (mobileFaqAccordion) => {
        return new Accordion(mobileFaqAccordion);
      },
    );
  },
  _resetMobileAccordionSettings() {
    const mobileAccordionItem = this?.container?.querySelector(SELECTORS.mobileAccordionItem);
    mobileAccordionItem.querySelector(SELECTORS.accordionItemPanel).removeAttribute('hidden');
    mobileAccordionItem
      .querySelector(SELECTORS.accordionItemTitle)
      .querySelector(SELECTORS.accordionItemButton)
      .setAttribute('aria-expanded', 'true');
  },
  _destroyMobileAccordion() {
    this?._mobileAccordions?.forEach((accordion) => accordion.destroyAccordion());
    this._mobileAccordions = null;
    this._resetMobileAccordionSettings();
  },
  _handleWindowResize() {
    if (window.innerWidth > BREAKPOINT) {
      this._destroyMobileAccordion();
    } else {
      this._initMobileAccordion();
    }
  },

  onLoad() {
    this?.container?.querySelectorAll(SELECTORS.accordion).forEach((faqAccordion) => {
      return new Accordion(faqAccordion);
    });
    window.addEventListener('resize', debounce(this._handleWindowResize.bind(this), 300));
    if (window.innerWidth > BREAKPOINT) {
      return;
    }
    this._initMobileAccordion();
  },
});
