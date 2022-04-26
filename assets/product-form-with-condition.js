if (!customElements.get("product-form-with-condition")) {
  customElements.define(
    "product-form-with-condition",
    class ProductFormWithCondition extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector("form");
        this.form.querySelector("[name=id]").disabled = false;
        this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
        this.cartNotification = document.querySelector("cart-notification");
        this.cartConditionNotification = document.querySelector(
          "cart-condition-notification"
        );
      }

      /**
       * Checks if cart conditions were violated and add to cart if they weren't.
       * onSubmit event listener for add to cart button
       * @param {Event} event
       * @returns {Promise} promise
       */
      async onSubmitHandler(evt) {
        evt.preventDefault();
        let checkCartCondition = new CheckCartCondition({
          maxTotalProductsQuantity: this.getAttribute(
            "max_total_products_quantity"
          ),
          maxEachProductQuantity: this.getAttribute(
            "max_each_product_quantity"
          ),
          maxCartTotal: this.getAttribute("max_cart_total"),
        })

        let hasCartConditionBeenViolated = await checkCartCondition.isViolatedProductPage({
          productPriceRaw: this.getAttribute("product_price"),
          productId: this.form.querySelector("input[name=id]").value,
        });

        if (hasCartConditionBeenViolated) {
          this.cartConditionNotification.setActiveElement(
            document.activeElement
          );
          this.cartConditionNotification.renderContents();
          return;
        }

        this.addToCart();
      }

      addToCart() {
        const submitButton = this.querySelector('[type="submit"]');
        if (submitButton.classList.contains("loading")) return;

        this.handleErrorMessage();
        this.cartNotification.setActiveElement(document.activeElement);

        submitButton.setAttribute("aria-disabled", true);
        submitButton.classList.add("loading");
        this.querySelector(".loading-overlay__spinner").classList.remove(
          "hidden"
        );

        const config = fetchConfig("javascript");
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        delete config.headers["Content-Type"];

        const formData = new FormData(this.form);
        formData.append(
          "sections",
          this.cartNotification
            .getSectionsToRender()
            .map((section) => section.id)
        );
        formData.append("sections_url", window.location.pathname);
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              this.handleErrorMessage(response.description);
              return;
            }

            this.cartNotification.renderContents(response);
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            submitButton.classList.remove("loading");
            submitButton.removeAttribute("aria-disabled");
            this.querySelector(".loading-overlay__spinner").classList.add(
              "hidden"
            );
          });
      }

      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper =
          this.errorMessageWrapper ||
          this.querySelector(".product-form__error-message-wrapper");
        this.errorMessage =
          this.errorMessage ||
          this.errorMessageWrapper.querySelector(
            ".product-form__error-message"
          );

        this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    }
  );
}
