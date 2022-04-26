class CartConditionNotification extends HTMLElement {
  constructor() {
    super();

    this.notification = document.getElementById('cart-condition-notification');
    this.header = document.querySelector('sticky-header');
    this.onBodyClick = this.handleBodyClick.bind(this);
    this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );
  }

  /**
   * Open notification.
   */
  open() {
    this.notification.classList.add('animate', 'active');

    this.notification.addEventListener('transitionend', () => {
      this.notification.focus();
      trapFocus(this.notification);
    }, { once: true });

    document.body.addEventListener('click', this.onBodyClick);
  }

  /**
   * Close notification.
   */
  close() {
    this.notification.classList.remove('active');
    document.body.removeEventListener('click', this.onBodyClick);

    removeTrapFocus(this.activeElement);
  }

  /**
   * Reveal shop's header if it's hidden and show notification.
   */
  renderContents() {
      if (this.header) this.header.reveal();
      this.open();
  }

  /**
   * Handle click outside notification.
   * @param {Event} evt 
   */
  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest('cart-condition-notification')) {
      const disclosure = target.closest('details-disclosure');
      this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
      this.close();
    }
  }

  /**
   * Set currently active element to focus on after closing notification.
   * @param {Element} element 
   */
  setActiveElement(element) {
    this.activeElement = element;
  }
}
  
customElements.define('cart-condition-notification', CartConditionNotification);