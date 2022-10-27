import { register } from '@shopify/theme-sections';

import { CartModal } from '../cart/modal';

import { FooterMenu } from './footer-menu';

import './index.scss';

register('footer', {
  onLoad() {
    if (!window.location.href.includes('cart')) {
      this._cartModal = new CartModal();
    }
    return new FooterMenu(this.container);
  },
});
