import jQuery from "jquery";

export const fadeIn = (element: HTMLElement, delay = 250) => {
  return new Promise(resolve => {
    jQuery(element).fadeIn(delay);
    const i = setInterval(() => {
      clearInterval(i);
      resolve(true);
    }, delay + 100);
  });
}
