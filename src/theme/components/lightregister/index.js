import { register } from '@shopify/theme-sections';
import './index.scss';

import { initLogin, initRecoverPassword, initRegister, setRedirection } from '../../../scripts/account/login';
import { LoginCollapseButton } from '../login/login-collapse-button';

const ACCOUNT_TEST_MODE = window.clientAPI.testMode === 'true';
const REDIRECTION = window.__ozjs?.privateSales?.urlRedirection;

register('lightregister', {
  loginCollapseButton: null,

  onLoad() {
    initLogin(ACCOUNT_TEST_MODE);
    initRecoverPassword(ACCOUNT_TEST_MODE);
    initRegister(ACCOUNT_TEST_MODE);
    setRedirection(REDIRECTION);
    this.loginCollapseButton = new LoginCollapseButton(this.container);
  },
});
