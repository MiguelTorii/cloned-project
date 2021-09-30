/* eslint-disable import/prefer-default-export */
import moment from 'moment';
import type { ToDos, CalendarEvents } from '../../types/models';
export const getEvents = (items: ToDos): CalendarEvents =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    start: moment(item.due),
    end: moment(item.due).add(1, 'hours'),
    label: item.label,
    status: item.status,
    due: moment(item.due).format('ddd MMM DD @HH:mm')
  }));
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
