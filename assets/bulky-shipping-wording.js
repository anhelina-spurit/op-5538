const STEPS = {
  PAYMENT_METHOD: 'payment_method',
};

const SELECTORS = {
  SHOPIFY_PAYMENT: {
    SHIPPING_METHOD_SELECTOR: '[data-review-section="shipping-cost"]',
    PAYMENT_METHOD: '[data-payment-method]',
  },
};



/**
 * UTILS
 */


function addBulkyShippingWording () {
  const DELIVERY_WORDING = 'livraison encombrant';

  const isBulkyShipping = document.querySelector(
    SELECTORS.SHOPIFY_PAYMENT.SHIPPING_METHOD_SELECTOR)?.textContent?.toLowerCase().includes(DELIVERY_WORDING);

  if (!isBulkyShipping) {
      return;
  }

  const deliveryLines = window.checkout_wording.translations.encombrant.split('.').map((line, index) => {
    if (line === '') {
      return '';
    }
    else {
      const classes = index === 0
        ? 'encombrant-delivery-line encombrant-delivery-line--first'
        : 'encombrant-delivery-line';
      return `<p class="${classes}">${line}.</p>`;
    }
  });
  const paymentMethodElement = document.querySelector(SELECTORS.SHOPIFY_PAYMENT.PAYMENT_METHOD);
  paymentMethodElement.insertAdjacentHTML('beforebegin', deliveryLines.join(''));

}

/**
 * ENTRY POINT
 */

document.addEventListener('page:load', () => {
  if(!Shopify.Checkout) return;
  const isPaymentStep = Shopify.Checkout.step === STEPS.PAYMENT_METHOD;
  if (!isPaymentStep) return;
  if (window.enable_tres_encombrant_delivery && window.enable_tres_encombrant_delivery === true) {
    addBulkyShippingWording();
  }
});
