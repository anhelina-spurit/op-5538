import { register } from '@shopify/theme-sections';

import { initLogin, initRecoverPassword, initRegister } from '../../../scripts/account/login';
import { LoginCollapseButton } from '../login/login-collapse-button';

const ACCOUNT_TEST_MODE = window.clientAPI.testMode === 'true';

register('register', {
  loginCollapseButton: null,

  onLoad() {
    initLogin(ACCOUNT_TEST_MODE);
    initRecoverPassword(ACCOUNT_TEST_MODE);
    initRegister(ACCOUNT_TEST_MODE);
    this.loginCollapseButton = new LoginCollapseButton(this.container);
  },
});
