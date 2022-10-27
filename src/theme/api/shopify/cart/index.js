export const cartAPI = {
  getState() {
    return fetch(`${theme.routes.cart_url}.js`).then((response) => response.json());
  },

  add(data) {
    return fetch(`${theme.routes.cart_add_url}.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  },

  update(data) {
    return fetch(`${theme.routes.cart_update_url}.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  },

  changeItem(data) {
    return fetch(`${theme.routes.cart_change_url}.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  },
};
