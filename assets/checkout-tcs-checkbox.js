const TCS_STEPS = {
  CONTACT_INFORMATION: 'contact_information',
};

const TCS_SELECTORS = {
  SHOPIFY_CONTACT_INFORMATION: {
    STEP_SECTIONS: '.step__sections',
    CONTINUE_BTN: '#continue_button',
  },
  TERMS_CHECKBOX: {
    WRAPPER: '#checkout-tcs',
    INPUT: '#checkout-tcs-input',
    LABEL: '#checkout-tcs-label',
    WARNING: '#checkout-tcs-warning',
  },
};

/**
 * COMPUTED CONSTANTS
 */

const isContactInformationStep = Shopify.Checkout.step === TCS_STEPS.CONTACT_INFORMATION;

/**
 * RENDERING
 */

function showWarning(show = true) {
  const warning = document.querySelector(TCS_SELECTORS.TERMS_CHECKBOX.WARNING);
  show ? warning?.classList.remove('hidden') : warning?.classList.add('hidden');
}

function enableContinueButton(enableBtn = true) {
  const continueBtn = document.querySelector(TCS_SELECTORS.SHOPIFY_CONTACT_INFORMATION.CONTINUE_BTN);
  enableBtn ? continueBtn?.classList.remove('disabled') : continueBtn?.classList.add('disabled');
}

function showTermsAndConditionsCheckbox() {
  const stepSections = document.querySelector(TCS_SELECTORS.SHOPIFY_CONTACT_INFORMATION.STEP_SECTIONS);
  const tcsWrapper = document.querySelector(TCS_SELECTORS.TERMS_CHECKBOX.WRAPPER);

  stepSections?.append(tcsWrapper);
  tcsWrapper?.classList.remove('hidden');
}

function toggleCheckbox() {
  const tcsInput = document.querySelector(TCS_SELECTORS.TERMS_CHECKBOX.INPUT);

  if (tcsInput && tcsInput.checked) {
    tcsInput.checked = false;
    tcsInput.value = '0';
    enableContinueButton(false);
  } else if (tcsInput) {
    tcsInput.checked = true;
    tcsInput.value = '1';
    enableContinueButton();
    showWarning(false);
  }
}

/**
 * FUNCTIONAL
 */

function setContinueBtnInitialState() {
  const tcsInput = document.querySelector(TCS_SELECTORS.TERMS_CHECKBOX.INPUT);

  if (!tcsInput?.checked) enableContinueButton(false);
}

function disableShopifyNextStep() {
  const continueBtn = document.querySelector(TCS_SELECTORS.SHOPIFY_CONTACT_INFORMATION.CONTINUE_BTN);
  const tcsInput = document.querySelector(TCS_SELECTORS.TERMS_CHECKBOX.INPUT);

  continueBtn.addEventListener('click', (event) => {
    if (!tcsInput?.checked) {
      event.preventDefault();
      showWarning();
    }
  });
}

function initTcsLabelClick() {
  const tcsLabel = document.querySelector(TCS_SELECTORS.TERMS_CHECKBOX.LABEL);
  tcsLabel?.addEventListener('click', () => toggleCheckbox());
}

function initTermsAndConditionsCheckbox() {
  const tcsInput = document.querySelector(TCS_SELECTORS.TERMS_CHECKBOX.INPUT);

  tcsInput?.addEventListener('change', toggleCheckbox);
  tcsInput?.addEventListener('click', toggleCheckbox);
}

/**
 * ENTRY POINT
 */

document.addEventListener('page:load', () => {
  if (isContactInformationStep) {
    setContinueBtnInitialState();
    showTermsAndConditionsCheckbox();
    disableShopifyNextStep();
    initTermsAndConditionsCheckbox();
    initTcsLabelClick();
  }
});
