import { register } from '@shopify/theme-sections';

import DropdownTabs from '../../dropdown-tabs';

import './index.scss';

register('commitments-map', {
  onLoad() {
    this._toggler = new DropdownTabs(this.container);
  },
});
