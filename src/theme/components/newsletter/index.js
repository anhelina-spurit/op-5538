import { register } from '@shopify/theme-sections';

import { initOzNewsletter } from '../../../scripts/newsletter';

import './index.scss';

register('newsletter', {
  onLoad() {
    initOzNewsletter();
  },
});
