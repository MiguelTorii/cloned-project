/* eslint-disable import/prefer-default-export */
// @flow

import moment from 'moment';
import type { ToDos, CalendarEvents } from '../../types/models';

export const getEvents = (items: ToDos): CalendarEvents => {
  return items.map(item => ({
    id: item.id,
    title: item.title,
    start: moment(item.due),
    end: moment(item.due).add(1, 'hours'),
    label: item.label
  }));
};

export const navigate = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE'
};

export const views = {
  MONTH: 'month',
  WEEK: 'week',
  WORK_WEEK: 'work_week',
  DAY: 'day',
  AGENDA: 'agenda'
};
