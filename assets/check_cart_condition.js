/**
 * Check if condition was violated from updating cart in product or cart page.
 * @class
 */
class CheckCartCondition {
  /**
   * @typedef CartConditionSettings
   * @type {object}
   * @property {string} maxTotalProductsQuantity maximum total quantity of products in cart.
   * @property {string} maxEachProductQuantity maximum quanity of one product in cart.
   * @property {string} maxCartTotal maximum total price of cart (in cents).
   */
  /**
   * Set settings from theme.
   * @param {CartConditionSettings} param0 
   */
   constructor({maxTotalProductsQuantity, maxEachProductQuantity, maxCartTotal}) {
    this.maxTotalProductsQuantity = parseInt(maxTotalProductsQuantity) || undefined;
    this.maxEachProductQuantity = parseInt(maxEachProductQuantity) || undefined;
    this.maxCartTotal = parseInt(maxCartTotal) || undefined;
  }

  /**
   * @typedef isViolatedCartPageArgs
   * @type {object}
   * @property {number} productIndex product index in cart. Starts from 1.
   * @property {number} productQuantity quantity of product to be added.
   */
  /**
   * Check if cart conditions were violated when updating cart from cart page.
   * @param {isViolatedCartPageArgs} param0 
   * @returns {Promise<boolean>} whether cart conditions were violated.
   */
  async isViolatedCartPage({productIndex, productQuantity}) {
    let {
      totalProductsQuantity,
      thisProductQuantity,
      cartTotal,
      cartProductPrice
    } = await this.#getCartFromProductIndex(productIndex);

    let productPrice = cartProductPrice;

    totalProductsQuantity += productQuantity;
    thisProductQuantity += productQuantity;
    cartTotal += productQuantity * productPrice;
  
    return (
      totalProductsQuantity > this.maxTotalProductsQuantity ||
      thisProductQuantity > this.maxEachProductQuantity ||
      cartTotal > this.maxCartTotal
    );
  }

  /**
   * @typedef isViolatedProductPageArgs
   * @type {object}
   * @property {number} productId product id.
   * @property {string} productPriceRaw product price per one item.
   */
  /**
   * Check if cart conditions were violated when updating cart from cart page.
   * @param {isViolatedCartPageArgs} param0 
   * @returns {Promise<boolean>} whether cart conditions were violated.
   */
  async isViolatedProductPage({productId, productPriceRaw}) {
      let productPrice = parseFloat(productPriceRaw?.replaceAll(",", ".")) * 100 || undefined;
      let productQuantity = parseInt(document.querySelector("input[name=quantity]").value);

      let {
        totalProductsQuantity,
        thisProductQuantity,
        cartTotal
      } = await this.#getCartFromProductId(productId);

      totalProductsQuantity += productQuantity;
      thisProductQuantity += productQuantity;
      cartTotal += productQuantity * productPrice;
    
      return (
        totalProductsQuantity > this.maxTotalProductsQuantity ||
        thisProductQuantity > this.maxEachProductQuantity ||
        cartTotal > this.maxCartTotal
      );
  }

  async #getCart() {
    const config = fetchConfig("javascript");
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    delete config.headers["Content-Type"];
  
    try {
      let response = await fetch(`${routes.cart_url}`, config);
      response = await response.json();
  
      return response;
    } catch (error) {
      throw error;
    }
  }

  async #getCartFromProductId(productId) {
    try {
      let response = await this.#getCart();
      let product = response.items.find(({ id }) => {
        return id == productId;
      });
  
      return {
        totalProductsQuantity: response.item_count || 0,
        cartTotal: response.total_price || 0,
        thisProductQuantity: (product && product.quantity) || 0
      };
    } catch (error) {
      console.error(error);
    }
  }

  async #getCartFromProductIndex(productIndex) {
    try {
      let response = await this.#getCart();
      let product = response.items[productIndex - 1];
  
      return {
        totalProductsQuantity: response.item_count || 0,
        cartTotal: response.total_price || 0,
        thisProductQuantity: (product && product.quantity) || 0,
        cartProductPrice: (product && product.original_price) || undefined
      };
    } catch (error) {
      console.error(error);
    }
  }
}

window.CheckCartCondition = CheckCartCondition;