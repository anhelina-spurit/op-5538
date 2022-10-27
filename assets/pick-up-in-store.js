const PUIS_CONSTANTS = {
  BOUTIQUES_LIST: JSON.parse(window.pick_up_in_store?.stores)?.stores,
};

const PUIS_STEPS = {
  CONTACT_INFORMATION: 'contact_information',
  SHIPPING_METHOD: 'shipping_method',
  PAYMENT_METHOD: 'payment_method',
};

const BOUTIQUE_DATA_ATTR = {
  NAME: 'y2name',
  ADDR: 'addr',
  ZIP: 'zip',
  CITY: 'city',
  COUNTRY: 'country',
  COUNTRY_CODE: 'country_code',
  CODE: 'code',
};

const PUIS_SELECTORS = {
  CHECKOUT_ATTRIBUTES: '.PUIS_checkout-attr',
  SHOPIFY_SHIPPING: {
    SHIPPING_METHOD_FORM: '[data-shipping-method-form="true"]',
    CONTAINER: '.content-box__row',
    DATA_SHIPPING_METHOD: '[data-shipping-method]',
    BOUTIQUE_OPTION: '[data-shipping-method*="Boutique"]',
    BOUTIQUE_OPTION_RADIO: '[data-shipping-method*="Boutique"] .input-radio',
    ANY_METHOD_OPTION_RADIO: '[name="checkout[shipping_rate][id]"]',
    NOTES_ATTRIBUTES_INPUT: '[name="checkout[attributes][pick_in_store_boutique_code]"]',
    PUIS_CUSTOM_CHECKOUT_INPUTS: 'puis-custom-input',
    CONTINUE_BTN: '#continue_button',
  },
  PICK_UP_IN_STORE: {
    PICK_BOUTIQUE_BTN: '#PUIS_pick-boutique',
    MODAL: '#PUIS_modal',
    MODAL_CLOSE_BTN: '#PUIS_close-btn',
    BOUTIQUES_LIST: '.PUIS_boutiques-list',
    BOUTIQUE_INPUT: '.PUIS_boutiques-list__input',
    BOUTIQUE_SUBMIT: '#PUIS_submit-boutique',
    SELECTED_BOUTIQUE_WRAPPER: '#PUIS_selected-boutique-wrapper',
    SELECTED_BOUTIQUE_PLACEHOLDER: '#PUIS_selected-boutique-placeholder',
  },
  SHOPIFY_PAYMENT: {
    PUIS_CHECKOUT_ATTRIBUTE: '[name="checkout[attributes][pick_in_store_boutique_code]"]',
    SHIPPING_METHOD_SELECTOR: '[data-review-section="shipping-cost"]',
    SAME_BILLING_ADDRESS_INPUT: '#checkout_different_billing_address_false',
    DIFFERENT_BILLING_ADDRESS_INPUT: '#checkout_different_billing_address_true',
    DIFFERENT_BILLING_ADDRESS_CONTENT: '#section--billing-address__different',
  },
};

/**
 * COMPUTED CONSTANTS
 */

const isContactStep = Shopify.Checkout.step === PUIS_STEPS.CONTACT_INFORMATION;
const isShippingStep = Shopify.Checkout.step === PUIS_STEPS.SHIPPING_METHOD;
const isPaymentStep = Shopify.Checkout.step === PUIS_STEPS.PAYMENT_METHOD;

/**
 * UTILS
 */

function closePUISModal() {
  const modal = document.querySelector(PUIS_SELECTORS.PICK_UP_IN_STORE.MODAL);
  modal.style.display = 'none';
}

function openPUISModal() {
  const modal = document.querySelector(PUIS_SELECTORS.PICK_UP_IN_STORE.MODAL);
  modal.style.display = 'block';
}

/**
 * RENDERING
 */

function showSelectedBoutiqueWrapper(display = true) {
  const selectedBoutiqueWrapper = document.querySelector(PUIS_SELECTORS.PICK_UP_IN_STORE.SELECTED_BOUTIQUE_WRAPPER);
  display ? selectedBoutiqueWrapper.classList.remove('hidden') : selectedBoutiqueWrapper.classList.add('hidden');
}

function renderPickStoreButton() {
  const pickUpInStoreOption = document.querySelector(PUIS_SELECTORS.SHOPIFY_SHIPPING.BOUTIQUE_OPTION);
  const html = `
    <div id="PUIS_selected-boutique-wrapper" class="hidden">
      <h2 class="section__title" id="main-header" tabindex="-1">
        ${window.pick_up_in_store.translations.your_selected_boutique} :
      </h2>
      <div id="PUIS_selected-boutique-placeholder"></div>
    </div>
    <button name="button" type="button" id="PUIS_pick-boutique" class="btn" aria-busy="false">
      <span class="btn__content">${window.pick_up_in_store.translations.pick_boutique}</span>
    </button>
  `;
  pickUpInStoreOption?.insertAdjacentHTML('afterend', html);
}

function renderSelectedBoutiqueDetails(selectedBoutique) {
  const selectedBoutiquePlaceholder = document.querySelector(
    PUIS_SELECTORS.PICK_UP_IN_STORE.SELECTED_BOUTIQUE_PLACEHOLDER,
  );
  const html = `
    <div class="PUIS_boutique-title">${selectedBoutique[BOUTIQUE_DATA_ATTR.NAME]}</div>
    <div>${selectedBoutique[BOUTIQUE_DATA_ATTR.ADDR]}</div>
    <div><span>${selectedBoutique[BOUTIQUE_DATA_ATTR.ZIP]}</span> <span>${
    selectedBoutique[BOUTIQUE_DATA_ATTR.CITY]
  }</span></div>
    <div>${selectedBoutique[BOUTIQUE_DATA_ATTR.COUNTRY]}</div>
  `;
  selectedBoutiquePlaceholder.innerHTML = html;
  showSelectedBoutiqueWrapper();
}

function editPickBoutiqueBtnLabel(wording) {
  const pickBoutiqueBtn = document.querySelector(PUIS_SELECTORS.PICK_UP_IN_STORE.PICK_BOUTIQUE_BTN);
  if (pickBoutiqueBtn) {
    pickBoutiqueBtn.textContent = wording;
  }
}

function emptySelectedBoutiquePlaceholder() {
  const selectedBoutiquePlaceholder = document.querySelector(
    PUIS_SELECTORS.PICK_UP_IN_STORE.SELECTED_BOUTIQUE_PLACEHOLDER,
  );
  selectedBoutiquePlaceholder.innerHTML = '';
}

function removeCustomCheckoutInputs() {
  const customCheckoutInput = document.querySelectorAll(
    `.${PUIS_SELECTORS.SHOPIFY_SHIPPING.PUIS_CUSTOM_CHECKOUT_INPUTS}`,
  );
  Array.from(customCheckoutInput).forEach((input) => input.remove());
}

/**
 * FUNCTIONAL
 */

function isPickUpInStoreMethod() {
  return document
    .querySelector(PUIS_SELECTORS.SHOPIFY_PAYMENT.SHIPPING_METHOD_SELECTOR)
    ?.textContent?.toLowerCase()
    .includes('boutique');
}

function addFormAttributes(selectedBoutique) {
  const shippingMethodForm = document.querySelector(PUIS_SELECTORS.SHOPIFY_SHIPPING.SHIPPING_METHOD_FORM);
  const html = `
  <input type="hidden" class="${
    PUIS_SELECTORS.SHOPIFY_SHIPPING.PUIS_CUSTOM_CHECKOUT_INPUTS
  }" name="checkout[shipping_address][address1]" value="${selectedBoutique[BOUTIQUE_DATA_ATTR.NAME]}"/>
  <input type="hidden" class="${
    PUIS_SELECTORS.SHOPIFY_SHIPPING.PUIS_CUSTOM_CHECKOUT_INPUTS
  }" name="checkout[shipping_address][address2]" value="${selectedBoutique[BOUTIQUE_DATA_ATTR.ADDR]}"/>
  <input type="hidden" class="${
    PUIS_SELECTORS.SHOPIFY_SHIPPING.PUIS_CUSTOM_CHECKOUT_INPUTS
  }" name="checkout[shipping_address][city]" value="${selectedBoutique[BOUTIQUE_DATA_ATTR.CITY]}"/>
  <input type="hidden" class="${
    PUIS_SELECTORS.SHOPIFY_SHIPPING.PUIS_CUSTOM_CHECKOUT_INPUTS
  }" name="checkout[shipping_address][country]" value="${selectedBoutique[BOUTIQUE_DATA_ATTR.COUNTRY]}"/>
  <input type="hidden" class="${
    PUIS_SELECTORS.SHOPIFY_SHIPPING.PUIS_CUSTOM_CHECKOUT_INPUTS
  }" name="checkout[shipping_address][country_code]" value="${
    selectedBoutique[BOUTIQUE_DATA_ATTR.COUNTRY_CODE]
  }" />  <input type="hidden" class="${
    PUIS_SELECTORS.SHOPIFY_SHIPPING.PUIS_CUSTOM_CHECKOUT_INPUTS
  }" name="checkout[shipping_address][zip]" value="${selectedBoutique[BOUTIQUE_DATA_ATTR.ZIP]}" />
  <input type="hidden" class="${
    PUIS_SELECTORS.SHOPIFY_SHIPPING.PUIS_CUSTOM_CHECKOUT_INPUTS
  }" name="checkout[shipping_address][province]" value="" />
  <input type="hidden" class="${
    PUIS_SELECTORS.SHOPIFY_SHIPPING.PUIS_CUSTOM_CHECKOUT_INPUTS
  }" name="checkout[attributes][pick_in_store_boutique_code]" value="${selectedBoutique[BOUTIQUE_DATA_ATTR.CODE]}"/>
  `;
  shippingMethodForm.insertAdjacentHTML('beforeend', html);
}

function selectBoutiqueMethod() {
  const boutiqueRadioOption = document.querySelector(PUIS_SELECTORS.SHOPIFY_SHIPPING.BOUTIQUE_OPTION_RADIO);
  if (boutiqueRadioOption && !boutiqueRadioOption.checked) {
    boutiqueRadioOption.checked = true;
  }
}

function onPickBoutiqueBtnClick() {
  const pickBoutiqueBtn = document.querySelector(PUIS_SELECTORS.PICK_UP_IN_STORE.PICK_BOUTIQUE_BTN);
  const modalCloseBtn = document.querySelector(PUIS_SELECTORS.PICK_UP_IN_STORE.MODAL_CLOSE_BTN);
  const modal = document.querySelector(PUIS_SELECTORS.PICK_UP_IN_STORE.MODAL);

  pickBoutiqueBtn?.addEventListener('click', () => {
    selectBoutiqueMethod();
    openPUISModal();
  });

  modalCloseBtn?.addEventListener('click', closePUISModal);

  window.onclick = function (event) {
    if (event.target === modal) {
      closePUISModal();
    }
  };
}

function onBoutiqueSubmitted() {
  const submitBoutiqueBtn = document.querySelector(PUIS_SELECTORS.PICK_UP_IN_STORE.BOUTIQUE_SUBMIT);
  submitBoutiqueBtn.addEventListener('click', () => {
    const selectedBoutiqueCode = submitBoutiqueBtn.getAttribute('data-puis-code');
    const selectedBoutique = PUIS_CONSTANTS.BOUTIQUES_LIST.find((boutique) => boutique.code === selectedBoutiqueCode);

    if (selectedBoutique) {
      closePUISModal();
      renderSelectedBoutiqueDetails(selectedBoutique);
      editPickBoutiqueBtnLabel(window.pick_up_in_store.translations.edit_boutique);
      addFormAttributes(selectedBoutique);
    }
  });
}

function preventNextStepWithoutSelectedBoutique() {
  const continueBtn = document.querySelector(PUIS_SELECTORS.SHOPIFY_SHIPPING.CONTINUE_BTN);
  const boutiqueOptionRadio = document.querySelector(PUIS_SELECTORS.SHOPIFY_SHIPPING.BOUTIQUE_OPTION_RADIO);

  continueBtn.addEventListener('click', (event) => {
    const boutiqueShippingIsChecked = boutiqueOptionRadio && boutiqueOptionRadio?.checked;
    const boutiqueCodeAttribute = document.querySelector(PUIS_SELECTORS.SHOPIFY_SHIPPING.NOTES_ATTRIBUTES_INPUT)?.value;
    const boutiqueAddressAttributes = document.querySelectorAll(
      `.${PUIS_SELECTORS.SHOPIFY_SHIPPING.PUIS_CUSTOM_CHECKOUT_INPUTS}`,
    );
    if (
      (boutiqueShippingIsChecked && !boutiqueCodeAttribute) ||
      (boutiqueShippingIsChecked && !boutiqueAddressAttributes.length)
    ) {
      event.preventDefault();
      openPUISModal();
    }
  });
}

// On shipping method clicked, remove boutique custom checkout inputs if boutique option is not selected
function cleanupSelectedBoutiqueData() {
  const continueBtn = document.querySelector(PUIS_SELECTORS.SHOPIFY_SHIPPING.CONTINUE_BTN);

  continueBtn.addEventListener('click', () => {
    const boutiqueRadioOption = document.querySelector(PUIS_SELECTORS.SHOPIFY_SHIPPING.BOUTIQUE_OPTION_RADIO);
    if (boutiqueRadioOption && !boutiqueRadioOption.checked) {
      emptySelectedBoutiquePlaceholder();
      editPickBoutiqueBtnLabel(window.pick_up_in_store.translations.pick_boutique);
      removeCustomCheckoutInputs();
      showSelectedBoutiqueWrapper(false);
      cleanupPUISCheckoutAttribute();
    }
  });
}

function cleanupPUISCheckoutAttribute() {
  const PUISCheckoutAttribute = document.querySelectorAll(PUIS_SELECTORS.SHOPIFY_PAYMENT.PUIS_CHECKOUT_ATTRIBUTE);
  Array.from(PUISCheckoutAttribute).forEach((attribute) => attribute.remove());
}

function initEditShippingMethodBtn() {
  const editShippingMethodLink = document.querySelector(`.review-block__link [href*="step=shipping_method"]`);
  if (!editShippingMethodLink) return;
  let editShippingMethodLinkContent = editShippingMethodLink.href;
  editShippingMethodLinkContent = editShippingMethodLinkContent.replace('shipping_method', 'contact_information');
  editShippingMethodLink.href = editShippingMethodLinkContent;
}

function selectDifferentBillingAddress() {
  const sameShippingAddressInput = document.querySelector(PUIS_SELECTORS.SHOPIFY_PAYMENT.SAME_BILLING_ADDRESS_INPUT);
  const sameShippingAddressContent = document.querySelector(
    PUIS_SELECTORS.SHOPIFY_PAYMENT.DIFFERENT_BILLING_ADDRESS_CONTENT,
  );
  const differentShippingAddressInput = document.querySelector(
    PUIS_SELECTORS.SHOPIFY_PAYMENT.DIFFERENT_BILLING_ADDRESS_INPUT,
  );
  if (sameShippingAddressInput && differentShippingAddressInput && sameShippingAddressContent) {
    sameShippingAddressInput.checked = false;
    differentShippingAddressInput.click();
  }
}

// Fix to prevent address2 to remain boutique's address2 rather than client's
// (Shopify Plus bug)
function resetAddressWhenFromBoutique() {
  const boutiqueCodeAttribute = document.querySelector(PUIS_SELECTORS.SHOPIFY_SHIPPING.NOTES_ATTRIBUTES_INPUT)?.value;
  if (!boutiqueCodeAttribute) return;
  const address1Field = document.querySelector('#checkout_shipping_address_address1');
  const address2Field = document.querySelector('#checkout_shipping_address_address2');
  const zipField = document.querySelector('#checkout_shipping_address_zip');
  const cityField = document.querySelector('#checkout_shipping_address_city');
  if (!address1Field || !address2Field || !zipField || !cityField) return;
  address1Field.value = '';
  address2Field.value = '';
  zipField.value = '';
  cityField.value = '';
}

function initPickUpInStore() {
  renderPickStoreButton();
  onPickBoutiqueBtnClick();
  onBoutiqueSubmitted();
  preventNextStepWithoutSelectedBoutique();
  cleanupSelectedBoutiqueData();
}

function captureCheckoutAttributes() {
  const currentForm = document.querySelector('form');
  const checkoutAttributes = document.querySelector(PUIS_SELECTORS.CHECKOUT_ATTRIBUTES);
  if (checkoutAttributes) currentForm.insertAdjacentElement('beforeend', checkoutAttributes);
}

/**
 * ENTRY POINT
 */

document.addEventListener('page:load', () => {
  if (isShippingStep) {
    initPickUpInStore();
    captureCheckoutAttributes();
  } else if (isContactStep) {
    resetAddressWhenFromBoutique();
  } else if (isPaymentStep) {
    if (isPickUpInStoreMethod()) {
      selectDifferentBillingAddress();
      initEditShippingMethodBtn();
    } else {
      cleanupPUISCheckoutAttribute();
    }
    captureCheckoutAttributes();
  }
});
