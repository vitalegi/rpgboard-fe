export const timestamp = () =>
  window.performance &&
  window.performance.now &&
  window.performance.timing &&
  window.performance.timing.navigationStart
    ? window.performance.now() + window.performance.timing.navigationStart
    : Date.now();
