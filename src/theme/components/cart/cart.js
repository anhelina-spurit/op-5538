import { EventEmitter } from 'eventemitter3';

import { cartAPI } from '../../api/shopify/cart';
import { unescapeHTML } from '../../utils/unescape-html';

const RESPONSE_STATUSES = {
  ERROR: 422,
};

/** Class representing a "Cart" */
class Cart extends EventEmitter {
  /**
   * @class Cart
   * @name Cart
   *
   * @constructor
   * */
  constructor() {
    super();
    if (typeof Cart.instance === 'object') {
      return Cart.instance; // eslint-disable-line no-constructor-return
    }
    Cart.instance = this;
    return this; // eslint-disable-line no-constructor-return
  }

  /**
   * @method getState
   * @return Object
   */
  getState() {
    return cartAPI.getState();
  }

  /**
   * @method validateQuantityItem
   * @param action {string}
   * @param state {Object}
   * @param items {Array}
   * @return string
   */
  validateQuantityItem(action, state, items) {
    let error = null;
    // eslint-disable-next-line consistent-return
    items.forEach((item) => {
      const inStateItem = state.items.find((stateItem) => stateItem.id === item.id);

      if (inStateItem) {
        const totalQuantity = action === 'add' ? inStateItem.quantity + item.quantity : item.quantity;
        if (totalQuantity > Number(window.cartStrings.quantity_max_line_product_value)) {
          error = unescapeHTML(window.cartStrings.quantity_max_line_product);
        }
        return error;
      }

      if (state.items.length >= Number(window.cartStrings.quantity_max_lines_products_value)) {
        error = unescapeHTML(window.cartStrings.quantity_max_lines_products);
        return error;
      }
    });
    return error;
  }

  /**
   * @method add
   * @param data {[{id: number, quantity: number, properties: {}}]}
   * @return Object
   */
  async add(data) {
    const items = {
      items: [...data],
    };
    const state = await this.getState();
    const messages = this.validateQuantityItem('add', state, items.items);

    if (messages) {
      this.emit('cart:change', {
        type: 'error',
        messages,
        state,
      });
      return;
    }
    // eslint-disable-next-line consistent-return
    return cartAPI.add(items).then((response) => {
      this.emit('cart:change', response);
      document.dispatchEvent(
        new CustomEvent('cart:add', {
          detail: {
            product: response.items,
          },
        }),
      );
      return response;
    });
  }

  /**
   * @method update
   * @param data {Object}
   * @return Object
   */
  update(data) {
    const items = {
      updates: {
        ...data,
      },
    };
    return cartAPI.update(items).then((response) => {
      this.emit('cart:change', response);
      return response;
    });
  }

  /**
   * @method changeItem
   * @param id {string}
   * @param quantity {number}
   * @param action {string}
   * @return Object
   */
  async changeItem(id, quantity, action) {
    const items = [{ id: Number(id.split(':')[0]), quantity }];
    const state = await this.getState();
    const messages = this.validateQuantityItem('change', state, items);
    if (messages) {
      this.emit('cart:change', {
        type: 'error',
        messages,
        state,
      });
      return;
    }
    // eslint-disable-next-line consistent-return
    return cartAPI.changeItem({ id, quantity }).then((response) => {
      this.emit('cart:change', response);
      document.dispatchEvent(
        new CustomEvent('cart:change', {
          detail: {
            product: response.items.filter((item) => item.key === id),
            action,
          },
        }),
      );
      return response;
    });
  }

  /**
   * @method remove
   * @param data {[string]}
   */
  remove(data) {
    const result = data.reduce((target, index) => {
      target[index] = 0;
      return target;
    }, {});

    return this.getState().then((res) => {
      let removedProducts = [];
      data.forEach((key) => {
        removedProducts = [...removedProducts, res.items.filter((item) => item.key === key)];
      });

      // eslint-disable-next-line promise/no-nesting
      return this.update(result)
        .then((response) => {
          document.dispatchEvent(
            new CustomEvent('cart:remove', {
              detail: {
                removedProducts,
              },
            }),
          );
          return response;
        })
        .catch(console.error); // eslint-disable-line no-console
    });
  }

  /**
   * @method modifierItem
   */
  modifierItem(addProduct, removeProduct, quantity) {
    return cartAPI.add({ items: [...[{ id: addProduct, quantity, properties: {} }]] }).then((response) => {
      document.dispatchEvent(
        new CustomEvent('cart:add', {
          detail: {
            product: response.items,
          },
        }),
      );
      if (response.status === RESPONSE_STATUSES.ERROR) {
        return response;
      }
      return this.remove([removeProduct]);
    });
  }
}

export default Cart;
