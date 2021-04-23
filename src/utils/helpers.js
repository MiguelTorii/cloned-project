export const setIntervalWithFirstCall = (func: Function, delay: number) => {
  func();
  return setInterval(func, delay);
};
