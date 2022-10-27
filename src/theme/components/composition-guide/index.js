import { register } from '@shopify/theme-sections';

import { Accordion } from '../accordion';
import './index.scss';

const SELECTORS = {
  accordion: '[data-composition-guide-accordion]',
  accordionItemTitle: '.accordion-item__title',
  accordionItemButton: '.accordion-item__button',
  accordionItemPanel: '.accordion-item__panel',
};

register('composition-guide', {
  onLoad() {
    this?.container?.querySelectorAll(SELECTORS.accordion).forEach((faqAccordion) => {
      return new Accordion(faqAccordion);
    });
  },
});
