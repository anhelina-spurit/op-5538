import { register } from '@shopify/theme-sections';

import { initUnsubscribeOzNewsletter } from '../../../scripts/newsletter';

import './index.scss';

register('unsubscribe-newsletter', {
  onLoad() {
    initUnsubscribeOzNewsletter();
  },
});
