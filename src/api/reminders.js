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
    dueDate: Number((item.due_date: number) || 0),
    id: Number((item.id: number) || 0),
    label: Number((item.label: number) || 0),
    status: Number((item.status: number) || 0),
    title: String((item.title: string) || '')
  }));
};

export const createReminder = async ({
  userId,
  title,
  label,
  dueDate,
  status = 1
}: {
  userId: string,
  title: string,
  label: number,
  dueDate: number,
  status?: number
}) => {
  const token = await getToken();

  const result = await axios.post(
    `${API_ROUTES.USER}/${userId}/todo`,
    {
      title,
      label,
      due_date: dueDate,
      token: 'NA',
      status
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  return data;
};

export const updateReminder = async ({
  userId,
  id,
  status
}: {
  userId: string,
  id: number,
  status: number
}) => {
  const token = await getToken();

  const result = await axios.post(
    `${API_ROUTES.USER}/${userId}/todo/${id}/status`,
    {
      user_id: Number(userId),
      token: 'NA',
      status
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  return data;
};

export const deleteReminder = async ({
  userId,
  id
}: {
  userId: string,
  id: number
}) => {
  const token = await getToken();

  const result = await axios.post(
    `${API_ROUTES.USER}/${userId}/todo/${id}/destroy`,
    {
      user_id: Number(userId),
      token: 'NA'
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  return data;
};
