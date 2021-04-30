import moment from 'moment';
import _ from 'lodash';
import { TIME_ZONE } from '../constants/app';
import store from 'store';

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

export const isMasquerading = () => {
  return store.get('MASQUERADING') === true;
};
