import { register } from '@shopify/theme-sections';

import { initPersonalDetails } from '../../../scripts/account/personalDetails';
import { initFamilyTab } from '../../../scripts/account/children';

import './account-menu';
import './account-menu-content';
import './account-content-heading';
import './personal-information';
import './account-family';

import './index.scss';

const ACCOUNT_TEST_MODE = window.clientAPI.testMode === 'true';

register('account', {
  onLoad() {
    initPersonalDetails(ACCOUNT_TEST_MODE);
    initFamilyTab(ACCOUNT_TEST_MODE);
  },
});
