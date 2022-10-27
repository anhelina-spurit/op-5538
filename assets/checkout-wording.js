const WORDING_STEPS = {
  SHIPPING_METHOD: 'shipping_method',
  PAYMENT_METHOD: 'payment_method',
};

const SHIPPING_METHOD_ATTR = 'data-shipping-method';

const SHIPPING_METHODS_OPTIONS = ['boutique', 'domicile', 'relay', 'colissimo'];

/**
 * COMPUTED CONSTANTS
 */

const isShippingShopifyStep = Shopify.Checkout.step === WORDING_STEPS.SHIPPING_METHOD;

/**
 * RENDERING
 */

function addWording(methodElement, optionName) {
  const methodWording = window.checkout_wording.translations[optionName];
  const html = `
    <div style="margin: 0 2.2em 1em; font-size: 90%;">${methodWording}</div>
  `;
  if (methodElement && methodWording) {
    methodElement?.insertAdjacentHTML('afterend', html);
  }
}

function addShippingMethodWording() {
  const shippingMethods = document.querySelectorAll(`[${SHIPPING_METHOD_ATTR}]`);

  Array.from(shippingMethods).forEach((method) => {
    const methodName = method.getAttribute(SHIPPING_METHOD_ATTR)?.toLowerCase();
    const optionName = SHIPPING_METHODS_OPTIONS.find((option) => methodName.includes(option));
    if (optionName) addWording(method, optionName);
  });
}

/**
 * ENTRY POINT
 */

document.addEventListener('page:load', () => {
  if (isShippingShopifyStep) {
    addShippingMethodWording();
  }
});
