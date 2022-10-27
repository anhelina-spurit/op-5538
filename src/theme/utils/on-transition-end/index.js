export function onTransitionEnd(element, callback, options = {}) {
  if (!element || !callback) {
    return;
  }

  const handleTransitionEnd = (event) => {
    const handle = () => {
      callback();

      if (options.once === true) {
        element.removeEventListener('transitionend', handleTransitionEnd);
      }
    };

    if (typeof options.property === 'string') {
      if (event.propertyName === options.property) {
        handle();
      }
    } else {
      handle();
    }
  };

  element.addEventListener('transitionend', handleTransitionEnd);
}
