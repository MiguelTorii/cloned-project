import { convert } from 'html-to-text';
import _ from 'lodash';
import moment from 'moment';
import qs from 'query-string';

import { TIME_ZONE } from 'constants/app';

export const getPointsText = (points: number) =>
  points ? Math.floor(points).toLocaleString() : '0';
export const momentWithTimezone = (date: string) => moment(date).tz(TIME_ZONE);
export const isApiCalling = (type) => (state) => _.get(state.api[type], 'inProgress', false);
export const getPastClassIds = (classList) =>
  classList
    .map((classEntry) => {
      if (!classEntry.isCurrent) {
        return classEntry.classId;
      }

      return '';
    })
    .filter((item) => item);
export const setIntervalWithFirstCall = (func: (...args: Array<any>) => any, delay: number) => {
  func();
  return setInterval(func, delay);
};
export const normalizeArray = (array: any[], idField = 'id') => {
  const result = {};
  array.forEach((item) => {
    result[item[idField]] = item;
  });
  return {
    byId: result,
    ids: array.map((item) => item[idField])
  };
};
export const shuffleArray = (array: any[]) => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
};
export const truncate = (string, n) => {
  if (string) {
    const truncatedString = string.length > n ? `${string.substr(0, n - 1)}...` : string;
    return truncatedString;
  }
  return '';
};

export const arrElemToId = (array: string[]) => {
  const result: string[] = [];
  array.forEach((elem, id) => {
    result[elem] = id;
  });
  return result;
};

export const extractTextFromHtml = (html) => {
  if (!html) {
    return '';
  }

  return convert(html);
};

export const englishIdFromNumber = (aNumber: number) => {
  if (aNumber === 0) {
    return 'A';
  }

  if (!aNumber) {
    return '';
  }

  const rem: number[] = [];

  while (aNumber >= 0) {
    rem.push(aNumber % 26);
    aNumber = Math.floor(aNumber / 26) - 1;
  }

  return rem
    .reverse()
    .map((id) => String.fromCharCode(65 + id))
    .join('');
};

export const twoDigitsNumber = (aNumber) => {
  if (!aNumber) {
    return '00';
  }
  const twoDigits = aNumber.toLocaleString('en-Us', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
  return twoDigits;
};

export const formatSeconds = (seconds) =>
  `${twoDigitsNumber(Math.floor(seconds / 60))}:${twoDigitsNumber(seconds % 60)}`;

export const deepLinkCheck = (pathname) => {
  if (!pathname) {
    return '';
  }
  const deepLinkRegExp = new RegExp(/^\/login\/(\d+)\/?$/);
  return deepLinkRegExp.test(pathname);
};

export const isMac = () => window.navigator.platform.includes('Mac');

export const commandHotkeyText = (key) => {
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
  return urls.findIndex((url) => path.startsWith(url)) >= 0;
};

export const buildPath = (rootPath, params) => `${rootPath}?${qs.stringify(params)}`;

export const openSupportWidget = (name: string, email: string) => {
  (window as any).FreshworksWidget('identify', 'ticketForm', { name, email });
  (window as any).FreshworksWidget('open');
};

export const waitUntil = (condition: () => boolean, polling = 100, timeout = 2000) =>
  new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      if (!condition()) {
        return;
      }

      clearInterval(interval);
      resolve();
    }, polling);

    setTimeout(() => {
      clearInterval(interval);
      reject('your error msg');
    }, timeout);
  });
