import { register } from '@shopify/theme-sections';

import {
  initLogin,
  initRecoverPassword,
  initRegister,
  showInfoAboutRecoverPasswordBlock,
} from '../../../scripts/account/login';

import { LoginCollapseButton } from './login-collapse-button';

import './index.scss';

const ACCOUNT_TEST_MODE = window.clientAPI.testMode === 'true';

register('login', {
  loginCollapseButton: null,

  onLoad() {
    initLogin(ACCOUNT_TEST_MODE);
    initRecoverPassword(ACCOUNT_TEST_MODE);
    initRegister(ACCOUNT_TEST_MODE);
    this.loginCollapseButton = new LoginCollapseButton(this.container);

    document.addEventListener('customer:request', (event) => {
      if (event.detail.status === 429) {
        showInfoAboutRecoverPasswordBlock();
      }
    });
  },
});
