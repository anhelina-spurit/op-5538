const MONDIAL_RELAY_STEPS = {
  SHIPPING_METHOD: 'shipping_method',
};

/**
 * COMPUTED CONSTANTS
 */

const isCheckoutShippingStep = Shopify.Checkout.step === MONDIAL_RELAY_STEPS.SHIPPING_METHOD;

/**
 * RENDERING
 */

function addMondialRelayScript() {
  // Code from https://doc.mondial-relay-app.com/article/59-code-a-ajouter-pour-les-clients-shopify-plus
  const enseigneClient = 'F3CYRIL1';
  const MondialRelayScript = document.createElement('script');
  MondialRelayScript.type = 'text/javascript';
  MondialRelayScript.src = 'https://shopify-mondial-relay.s3.eu-west-3.amazonaws.com/MR-select-pickup-shopify-plus.js';
  MondialRelayScript.setAttribute('enseigne', enseigneClient);
  document.getElementsByTagName('head')[0].appendChild(MondialRelayScript);

  // eslint-disable-next-line func-style
  const waitFunction = function () {
    if (document.querySelectorAll('.section--shipping-method input').length > 0) {
      const selectedInput = document.querySelector("input[checked='checked']");
      if (
        decodeURIComponent(selectedInput.getAttribute('value')).toLowerCase().indexOf('point de retrait') > 1 &&
        document.querySelectorAll('.section-shipping-method input')[1]
      ) {
        document.querySelectorAll('.section--shipping-method input')[1].click();
      } else {
        setTimeout(function () {
          waitFunction();
        }, 10);
      }
    }
  };
  waitFunction();
}

/**
 * ENTRY POINT
 */

document.addEventListener('page:load', () => {
  if (isCheckoutShippingStep) {
    addMondialRelayScript();
  }
});
