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

export const avatarTextFromName = (name: string) => {
  return name !== '' ? (name.match(/\b(\w)/g) || []).join('') : ''
};

export const isApiCalling = type => state => _.get(state.api[type], 'inProgress', false);

export const setIntervalWithFirstCall = (func: Function, delay: number) => {
  func();
  return setInterval(func, delay);
};

export const normalizeArray = (array: Array<any>, idField: string = 'id') => {
  let result = {};

  array.forEach((item) => {
    result[item[idField]] = item;
  });

  return {
    byId: result,
    ids: array.map((item) => item[idField])
  };
};

export const shuffleArray = (array) => {
  for(let i = array.length - 1; i > 0; i --){
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};
