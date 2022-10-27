import { register } from '@shopify/theme-sections';

import initCardsSlider from '../commitments-cards';

import './index.scss';

register('commitments-item', {
  onLoad() {
    this._slider = initCardsSlider(this.container);
  },
});
