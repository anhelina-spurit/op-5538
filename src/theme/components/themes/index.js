import { register } from '@shopify/theme-sections';

import DropdownTabs from '../dropdown-tabs';

import './index.scss';

register('themes', {
  onLoad() {
    this._toggler = new DropdownTabs(this.container);
  },
});
