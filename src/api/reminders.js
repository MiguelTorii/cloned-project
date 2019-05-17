/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { ToDos } from '../types/models';
import { getToken } from './utils';

export const getReminders = async ({
  userId
}: {
  userId: string
}): Promise<ToDos> => {
  const token = await getToken();

  const result = await axios.get(`${API_ROUTES.USER}/${userId}/todo?token=NA`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  const { todos = [] } = data;

  return todos.map(item => ({
    due: Number((item.due: number) || 0),
    dueDate: Number((item.dueDate: number) || 0),
    id: Number((item.id: number) || 0),
    label: Number((item.label: number) || 0),
    status: Number((item.status: number) || 0),
    title: String((item.title: string) || '')
  }));
};
