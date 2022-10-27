import './index.scss';

class QuantityInput {
  constructor(container) {
    this.input = container.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true });

    container
      .querySelectorAll('button')
      .forEach((button) => button.addEventListener('click', this.onButtonClick.bind(this)));

    this.input.addEventListener('input', this.onInput.bind(this));
  }

  onInput(event) {
    const previousValue = this.input.value;

    if (/^\d*$/.test(event.data)) event.preventDefault();
    if (Number(event.target.value) <= 0) this.input.value = this.input.min;
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }
}

export default QuantityInput;
