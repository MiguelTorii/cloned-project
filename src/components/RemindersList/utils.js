// @flow

import moment from 'moment';

const REFERENCE = moment();
const TODAY = REFERENCE.clone().startOf('day');
const TOMORROW = REFERENCE.clone().add(1, 'days').startOf('day');

const getDates = (items) => {
  return items.map((item) => ({
    ...item,
    due: moment(item.due).format('ddd MMM DD @HH:mm')
  }));
};

export const getOverdue = (items: Array<Object>) => {
  return getDates(
    items.filter((o) => {
      return moment(o.due).isBefore(TODAY, 'd');
    })
  );
};

export const getToday = (items: Array<Object>) => {
  return getDates(
    items.filter((o) => {
      return moment(o.due).isSame(TODAY, 'd');
    })
  );
};
export const getTomorrow = (items: Array<Object>) => {
  return getDates(
    items.filter((o) => {
      return moment(o.due).isSame(TOMORROW, 'd');
    })
  );
};
export const getUpcoming = (items: Array<Object>) => {
  return getDates(
    items.filter((o) => {
      return moment(o.due).isAfter(TOMORROW, 'd');
    })
  );
};
export const getLeftCount = (items: Array<Object>) => {
  const filtered = items.filter((o) => o.status === 1);
  return filtered ? filtered.length : 0;
};
