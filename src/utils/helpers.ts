import moment from "moment";
import _ from "lodash";
import qs from "query-string";
import { TIME_ZONE } from "../constants/app";
export const getPointsText = (points: number) => Math.floor(points).toLocaleString();
export const momentWithTimezone = (date: string = undefined) => moment(date).tz(TIME_ZONE);
export const isApiCalling = type => state => _.get(state.api[type], 'inProgress', false);
export const getPastClassIds = classList => classList.map(classEntry => {
  if (!classEntry.isCurrent) {
    return classEntry.classId;
  }

  return '';
}).filter(item => item);
export const setIntervalWithFirstCall = (func: (...args: Array<any>) => any, delay: number) => {
  func();
  return setInterval(func, delay);
};
export const normalizeArray = (array: Array<any>, idField: string = 'id') => {
  const result = {};
  array.forEach(item => {
    result[item[idField]] = item;
  });
  return {
    byId: result,
    ids: array.map(item => item[idField])
  };
};
export const shuffleArray = array => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
};
export const truncate = (str, n) => str.length > n ? `${str.substr(0, n - 1)}...` : str;
export const arrElemToId = array => {
  const result = [];
  array.forEach((elem, id) => {
    result[elem] = id;
  });
  return result;
};
export const extractTextFromHtml = html => {
  if (!html) {
    return '';
  }

  const tempDivElement = document.createElement('div');
  tempDivElement.innerHTML = html;
  const result = tempDivElement.textContent || tempDivElement.innerText || '';
  return _.trim(result);
};
export const englishIdFromNumber = number => {
  if (number === 0) {
    return 'A';
  }

  const rem = [];

  while (number) {
    rem.push(number % 26);
    number = Math.floor(number / 26);
  }

  return rem.reverse().map(id => String.fromCharCode(65 + id)).join('');
};
export const twoDigitsNumber = number => number.toLocaleString('en-Us', {
  minimumIntegerDigits: 2,
  useGrouping: false
});
export const formatSeconds = seconds => `${twoDigitsNumber(Math.floor(seconds / 60))}:${twoDigitsNumber(seconds % 60)}`;
export const deepLinkCheck = pathname => {
  const deepLinkRegExp = new RegExp(/^\/login\/(\d+)\/?$/);
  return deepLinkRegExp.test(pathname);
};
export const isMac = () => window.navigator.platform.includes('Mac');
export const commandHotkeyText = key => {
  if (isMac()) {
    return `⌘${key}`;
  }

  return `CTRL + ${key}`;
};

/**
 * Check if two objects are same
 * - Two arrays with same elements in different order are same.
 */
export const isSame = (obj1, obj2) => {
  if (obj1 instanceof Array && obj2 instanceof Array) {
    return _.isEqual(obj1.sort(), obj2.sort());
  }

  return _.isEqual(obj1, obj2);
};
export const checkPath = (path, urls) => {
  if (!path) {
    return false;
  }

  return urls.findIndex(url => path.startsWith(url)) >= 0;
};
export const buildPath = (rootPath, params) => `${rootPath}?${qs.stringify(params)}`;