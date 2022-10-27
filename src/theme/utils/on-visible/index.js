import { isHiddenElement } from '../is-hidden-element';

export const onVisible = (element, callback) => {
  if (!isHiddenElement(element)) {
    callback();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) callback();
      });
    },
    {
      root: document.documentElement,
    },
  );

  observer.observe(element);
};
