import './index.scss';
import keyBinder from 'tinykeys';

class Selectbox {
  constructor(selectbox) {
    this.selectbox = selectbox;
    this.combobox = selectbox.querySelector('[role=combobox]');
    this.listbox = selectbox.querySelector('[role=listbox]');
    this.isListboxOpened = false;
    this.selectId = selectbox.getAttribute('data-select');

    this._addDefaultEventListeners();
  }

  setSelectBox(target) {
    this._selectOption(target);
    this._activateOption(target);
    this._updateListboxState(false);
  }

  _updateListboxState(isListboxOpened) {
    if (this.isListboxOpened === isListboxOpened) {
      return;
    }

    this.isListboxOpened = isListboxOpened;

    this.combobox.setAttribute('aria-expanded', isListboxOpened);

    if (isListboxOpened) {
      this.selectbox.classList.add('selectbox--opened');
    } else {
      this.selectbox.classList.remove('selectbox--opened');
    }
  }

  _maintainScrollVisibility(option) {
    const { offsetHeight, offsetTop } = option;
    const { offsetHeight: parentOffsetHeight, scrollTop } = this.listbox;

    const isAbove = offsetTop < scrollTop;
    const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

    if (isAbove) {
      this.listbox.scrollTo(0, offsetTop);
    } else if (isBelow) {
      this.listbox.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }
  }

  _isScrollable() {
    return this.listbox && this.listbox.clientHeight < this.listbox.scrollHeight;
  }

  _activateOption(option) {
    const disabled = Boolean(option.getAttribute('aria-disabled'));
    if (disabled) return;
    const active = this.listbox.querySelector('.selectbox__option--active');
    active?.classList.remove('selectbox__option--active');
    option.classList.add('selectbox__option--active');

    if (this._isScrollable(option)) {
      this._maintainScrollVisibility(option);
    }
  }

  _selectOption(option) {
    const disabled = Boolean(option.getAttribute('aria-disabled'));
    if (disabled) return;

    const active = this.listbox.querySelector('[role="option"][aria-selected="true"]');
    active?.setAttribute('aria-selected', false);

    option.setAttribute('aria-selected', true);
    const optionValue = option.getAttribute('data-option-value');

    this.combobox.setAttribute('aria-activedescendant', option.getAttribute('id'));

    const currentOption = this.selectbox.querySelector(`[value="${optionValue}"]`);
    if (currentOption) currentOption.selected = true;
    this.selectbox.dispatchEvent(
      new Event('change', {
        bubbles: true,
      }),
    );
    this.combobox.innerHTML = option.innerHTML;
  }

  _checkPressedStatus() {
    if (this.isListboxOpened) {
      const activeOption = this.listbox.querySelector('.selectbox__option--active');
      activeOption && this._selectOption(activeOption);
      this._updateListboxState(false);
    } else {
      this._updateListboxState(true);
    }
  }

  _focusPreviousOption(event) {
    const options = this.listbox.querySelectorAll('[role="option"]');
    const activeOption = this.listbox.querySelector('.selectbox__option--active');

    for (let i = 0; i < options.length; i++) {
      if (activeOption === options[i]) {
        event.preventDefault();

        if (i === 0) {
          this._activateOption(options[options.length - 1]);
        } else {
          this._activateOption(options[i - 1]);
        }

        break;
      }
    }
  }

  _focusNextOption(event) {
    const options = this.listbox.querySelectorAll('[role="option"]');
    const activeOption = this.listbox.querySelector('.selectbox__option--active');
    const lastIndex = options.length - 1;

    for (let i = 0; i < options.length; i++) {
      if (activeOption === options[i]) {
        event.preventDefault();

        if (i === lastIndex) {
          this._activateOption(options[0]);
        } else {
          this._activateOption(options[i + 1]);
        }

        break;
      }
    }
  }

  _focusFirstOption(event) {
    const options = this.listbox.querySelectorAll('[role="option"]');
    event.preventDefault();
    this._activateOption(options[0]);
  }

  _focusLastOption(event) {
    const options = this.listbox.querySelectorAll('[role="option"]');
    event.preventDefault();
    this._activateOption(options[options.length - 1]);
  }

  _handleOptionClick(event) {
    event.stopPropagation();
    const currentOption = event.currentTarget;
    this._selectOption(currentOption);
    this._activateOption(currentOption);
    this._updateListboxState(false);
  }

  _handleComboboxClick(event) {
    event.preventDefault();
    let isListboxOpened = false;
    if (this.combobox.getAttribute('aria-expanded') === 'false') {
      isListboxOpened = true;
    }
    this._updateListboxState(isListboxOpened);
  }

  /**
   * Add default event listeners
   * @method _addDefaultEventListeners
   */
  _addDefaultEventListeners() {
    // eslint-disable-next-line consistent-this
    const _this = this;

    _this.combobox.addEventListener('click', function (event) {
      _this._handleComboboxClick(event);
    });

    _this.listbox.querySelectorAll('[role="option"]').forEach((option) => {
      option.addEventListener('click', function (event) {
        _this._handleOptionClick(event);
      });
    });

    _this.combobox.addEventListener('blur', function () {
      setTimeout(function () {
        if (!document.activeElement.closest('[role=listbox]')) {
          _this._updateListboxState(false);
        }
      }, 1);
    });

    keyBinder(
      this.combobox,
      {
        ArrowUp: this._focusPreviousOption.bind(this),
        ArrowDown: this._focusNextOption.bind(this),
        Home: this._focusFirstOption.bind(this),
        End: this._focusLastOption.bind(this),
        PageUp: this._focusFirstOption.bind(this),
        PageDown: this._focusLastOption.bind(this),
        Escape: this._updateListboxState.bind(this, false),
        Enter: this._checkPressedStatus.bind(this),
        Space: this._checkPressedStatus.bind(this),
      },
      {
        event: 'keyup',
      },
    );
  }
}

export { Selectbox };
