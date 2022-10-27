import { register } from '@shopify/theme-sections';

import { Accordion } from '../accordion';
import './index.scss';

const SELECTORS = {
  accordion: '[data-care-symbols-accordion]',
  accordionItemTitle: '.accordion-item__title',
  accordionItemButton: '.accordion-item__button',
  accordionItemPanel: '.accordion-item__panel',
};

register('care-symbols', {
  onLoad() {
    this?.container?.querySelectorAll(SELECTORS.accordion).forEach((careSymbolsAccordion) => {
      return new Accordion(careSymbolsAccordion);
    });
  },
});
