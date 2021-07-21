import moment from 'moment';
import _ from 'lodash';
import { TIME_ZONE } from '../constants/app';

export const getPointsText = (points: number) => {
  return points < 1000 ?
    points.toLocaleString() :
    `${Math.floor(points / 1000).toLocaleString()}K`
};

export const momentWithTimezone = (date: string = undefined) => {
  return moment(date).tz(TIME_ZONE);
};

export const isApiCalling = type => state => _.get(state.api[type], 'inProgress', false);

export const getPastClassIds = classList => classList.map(classEntry => {
  if (!classEntry.isCurrent) return classEntry.classId;
  return "";
}).filter(item => item)

export const setIntervalWithFirstCall = (func: Function, delay: number) => {
  func();
  return setInterval(func, delay);
};

export const normalizeArray = (array: Array<any>, idField: string = 'id') => {
  const result = {};

  array.forEach((item) => {
    result[item[idField]] = item;
  });

  return {
    byId: result,
    ids: array.map((item) => item[idField])
  };
};

export const shuffleArray = (array) => {
  const result = [...array];

  for(let i = result.length - 1; i > 0; i --){
    const j = Math.floor(Math.random() * i);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
};

export const arrElemToId = (array) => {
  const result = [];

  array.forEach((elem, id) => result[elem] = id);

  return result;
};

export const extractTextFromHtml = (html) => {
  if (!html) return '';
  const tempDivElement = document.createElement('div');
  tempDivElement.innerHTML = html;
  const result = tempDivElement.textContent || tempDivElement.innerText || '';
  return _.trim(result);
};

export const englishIdFromNumber = (number) => {
  if (number === 0) return 'A';

  const rem = [];

  while(number) {
    rem.push(number % 26);
    number = Math.floor(number / 26);
  }

  return rem.reverse().map((id) => String.fromCharCode(65 + id)).join('');
};

export const twoDigitsNumber = (number) => {
  return number.toLocaleString('en-Us', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
};

export const formatSeconds = (seconds) => {
  return `${twoDigitsNumber(Math.floor(seconds / 60))}:${twoDigitsNumber(seconds % 60)}`;
}

export const deepLinkCheck = (pathname) => {
  const deepLinkRegExp = new RegExp(/^\/login\/(\d+)\/?$/)
  return deepLinkRegExp.test(pathname)
}
