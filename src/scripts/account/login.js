import { notifyClientAPIResetThenCallShopify, notifyClientAPIThenCallShopify } from './api/clientAPI';
import { shopifyLogin, shopifyRecover, shopifyRegister } from './api/shopifyAPI';
import { clDebug, stringToHTML, getParameterByName } from './utils';

/*
 CONSTANTS
 ************************/

let redirection = null;

const CONSTANTS = {
  SELECTORS: {
    FORM_PASSWORD_INPUT: '.login-password-control__input',
    FORM_TOGGLE_PASSWORD_VIEW_BUTTON: '[data-toggle-password-view]',
    FORM_SUBMIT_BUTTON: 'button[type="submit"]',
    FORM_ERRORS_WRAPPER: '.form-errors-wrapper',
    FORM_ERRORS: '.errors',
    FORM_STATUS: '.status',
    LOGIN_FORM_ID: 'sign_in_form',
    REGISTER_FORM_ID: 'sign_up_form',
    RECOVERY_PASSWORD_FORM_ID: 'recovery_password_form',
    RECOVERY_FORM_FIELDSET_HEADER: '.login-fieldset--recovery .fieldset__header',
    RECOVERY_FORM_FIELDSET_BODY: '.login-fieldset--recovery .fieldset__body',
  },
  ROUTES: {
    CART: '/cart',
    ACCOUNT: '/account',
  },
};

/*
ERRORS HANDLING
************************/

function hideFormErrors(errorsWrapper, errors) {
  if (errorsWrapper && errors) {
    errorsWrapper.hidden = true;
    errors.remove();
  }
}

function showFormErrors(errorsWrapper, errors) {
  if (errorsWrapper && errors) {
    errorsWrapper.append(errors);
    errorsWrapper.hidden = false;
  }
}

/*
CALLBACKS
************************/

function authorizeUserInShopify(testMode, formData) {
  shopifyLogin(activateLoginForm.bind(this, testMode), formData);
}

function registerUserInShopify(testMode, formData) {
  const mobilePhoneNumber = `mobilePhoneNumber_${formData.get('mobilePhoneNumber')}`;
  const civility = formData.get('civility');

  const tags = `${mobilePhoneNumber},${civility}`;
  formData.append('customer[tags]', tags);

  shopifyRegister(activateRegisterForm.bind(this, testMode), formData);
}

function recoverPasswordInShopify(testMode, formData) {
  shopifyRecover(activateRecoveryForm.bind(this, testMode), formData);
}

/*
  FEEDBACK FUNCTIONS
************************/

function togglePasswordInputView(input) {
  if (!input) return;
  const type = input.getAttribute('type');

  if (type === 'password') {
    input.setAttribute('type', 'text');
  } else {
    input.setAttribute('type', 'password');
  }
}

function activateLoginForm(testMode, html) {
  const form = document.getElementById(CONSTANTS.SELECTORS.LOGIN_FORM_ID);

  if (!form) return;

  const submitBtn = form.querySelector(CONSTANTS.SELECTORS.FORM_SUBMIT_BUTTON);
  const errorsWrapper = form.querySelector(CONSTANTS.SELECTORS.FORM_ERRORS_WRAPPER);
  const formInResponse = stringToHTML(html).querySelector(`#${CONSTANTS.SELECTORS.LOGIN_FORM_ID}`);
  const errors = formInResponse ? formInResponse.querySelector(CONSTANTS.SELECTORS.FORM_ERRORS) : null;

  if (submitBtn) {
    submitBtn.disabled = false;
  }

  clDebug(testMode, `*** (html) :: activateLoginForm(): ${html}`);

  if (errors) {
    showFormErrors(errorsWrapper, errors);
  } else {
    redirect();
  }
}

function activateRecoveryForm(testMode, html) {
  const form = document.getElementById(CONSTANTS.SELECTORS.RECOVERY_PASSWORD_FORM_ID);

  if (!form) return;

  const fieldsetHeader = form.querySelector(CONSTANTS.SELECTORS.RECOVERY_FORM_FIELDSET_HEADER);
  const fieldsetBody = form.querySelector(CONSTANTS.SELECTORS.RECOVERY_FORM_FIELDSET_BODY);
  const errorsWrapper = form.querySelector(CONSTANTS.SELECTORS.FORM_ERRORS_WRAPPER);
  const submitBtn = form.querySelector(CONSTANTS.SELECTORS.FORM_SUBMIT_BUTTON);
  const formInResponse = stringToHTML(html).querySelector(`#${CONSTANTS.SELECTORS.RECOVERY_PASSWORD_FORM_ID}`);
  const errors = formInResponse ? formInResponse.querySelector(CONSTANTS.SELECTORS.FORM_ERRORS) : null;
  const successMessage = formInResponse ? formInResponse.querySelector(CONSTANTS.SELECTORS.FORM_STATUS) : null;

  if (submitBtn) {
    submitBtn.disabled = false;
  }

  clDebug(testMode, `*** (html) :: activateRecoveryForm(): ${html}`);

  if (errors) {
    showFormErrors(errorsWrapper, errors);
  } else {
    window.location.hash = '';

    if (fieldsetBody) {
      fieldsetBody.remove();
    }

    if (fieldsetHeader && successMessage) {
      fieldsetHeader.append(successMessage);
    }
  }
}

function activateRegisterForm(testMode, html) {
  const form = document.getElementById(CONSTANTS.SELECTORS.REGISTER_FORM_ID);

  if (!form) return;

  const submitBtn = form.querySelector(CONSTANTS.SELECTORS.FORM_SUBMIT_BUTTON);
  const errorsWrapper = form.querySelector(CONSTANTS.SELECTORS.FORM_ERRORS_WRAPPER);
  const formInResponse = stringToHTML(html).querySelector(`#${CONSTANTS.SELECTORS.REGISTER_FORM_ID}`);
  const errors = formInResponse ? formInResponse.querySelector(CONSTANTS.SELECTORS.FORM_ERRORS) : null;

  if (submitBtn) {
    submitBtn.disabled = false;
  }

  clDebug(testMode, `*** (html) :: activateRegisterForm(): ${html}`);

  if (errors) {
    showFormErrors(errorsWrapper, errors);
  } else {
    redirect();
  }
}

function redirect() {
  const checkoutUrl = getParameterByName('checkout_url');
  console.log('redirect, redirection  = ', redirection);
  if (redirection) {
    window.location.href = redirection;
  } else if (checkoutUrl) {
    window.location.href = CONSTANTS.ROUTES.CART;
  } else {
    window.location.href = CONSTANTS.ROUTES.ACCOUNT;
  }
}

/*
INITIALISATION
************************/

function initForm(testMode, formId = '', callback, isResetForm = false) {
  const form = document.getElementById(formId);

  if (!form) return;

  const submitBtn = form.querySelector(CONSTANTS.SELECTORS.FORM_SUBMIT_BUTTON);
  const passwordInput = form.querySelector(CONSTANTS.SELECTORS.FORM_PASSWORD_INPUT);
  const togglePasswordViewBtn = form.querySelector(CONSTANTS.SELECTORS.FORM_TOGGLE_PASSWORD_VIEW_BUTTON);

  if (passwordInput && togglePasswordViewBtn) {
    togglePasswordViewBtn.addEventListener('click', () => {
      togglePasswordInputView(passwordInput);
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Prevent form submission by other initiators such as application scripts
    event.stopImmediatePropagation();

    const formData = new FormData(form);
    const errorsWrapper = form.querySelector(CONSTANTS.SELECTORS.FORM_ERRORS_WRAPPER);
    const errors = errorsWrapper ? errorsWrapper.querySelector(CONSTANTS.SELECTORS.FORM_ERRORS) : null;

    if (submitBtn) {
      submitBtn.disabled = true;
    }

    hideFormErrors(errorsWrapper, errors);

    if (isResetForm) {
      notifyClientAPIResetThenCallShopify(testMode, callback.bind(this, testMode, formData), formData);
    } else {
      notifyClientAPIThenCallShopify(testMode, callback.bind(this, testMode, formData), formData);
    }
  });
}

/*
ENTRY POINT
************************/

export function initLogin(testMode) {
  initForm(testMode, CONSTANTS.SELECTORS.LOGIN_FORM_ID, authorizeUserInShopify);
}

export function initRecoverPassword(testMode) {
  initForm(testMode, CONSTANTS.SELECTORS.RECOVERY_PASSWORD_FORM_ID, recoverPasswordInShopify, true);
}

export function initRegister(testMode) {
  initForm(testMode, CONSTANTS.SELECTORS.REGISTER_FORM_ID, registerUserInShopify);
}

export function showInfoAboutRecoverPasswordBlock() {
  const wrapper = document
    .querySelector(`#${CONSTANTS.SELECTORS.RECOVERY_PASSWORD_FORM_ID}`)
    .querySelector(CONSTANTS.SELECTORS.FORM_ERRORS_WRAPPER);
  showFormErrors(wrapper, window?.variantStrings?.reset_password_block);
}

export function setRedirection(url) {
  redirection = url;
  console.log('setRedirection, redirection = ', redirection);
}
