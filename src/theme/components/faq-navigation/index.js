import { register } from '@shopify/theme-sections';
import debounce from 'lodash.debounce';

import './index.scss';

register('faq-navigation', {
  _handleLinkClick(event) {
    const target = event.target;
    const activeLinkClass = 'faq-navigation__link--active';
    this?.container?.querySelector(`.${activeLinkClass}`)?.classList.remove(activeLinkClass);
    target?.classList.add(activeLinkClass);
  },

  onLoad() {
    this?.container
      .querySelectorAll('.faq-navigation__item')
      .forEach((item) => item.addEventListener('click', debounce(this._handleLinkClick.bind(this), 300)));
  },
});
