/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { ToDo } from '../types/models';
import { logEvent } from './analytics';
import { getToken } from './utils';
import { APIToDo } from './models/APIToDo';

export const getReminders = async ({ userId }: { userId: string }): Promise<ToDo[]> => {
  try {
    const token = await getToken();
    const result: { data: { todos: APIToDo[] } } = await axios.get(
      `${API_ROUTES.USER}/${userId}/todo?token=NA`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { todos } = result.data;
    return todos.map((item: APIToDo) => ({
      due: item.due || 0,
      dueDate: item.due_date || 0,
      id: item.id || 0,
      label: item.label || 0,
      status: item.status || 0,
      title: item.title || ''
    }));
  } catch (err) {
    console.log(err);
    return [];
  }
};
export const createReminder = async ({
  userId,
  title,
  label,
  dueDate,
  status = 1
}: {
  userId: string;
  title: string;
  label: number;
  dueDate: number;
  status?: number;
}) => {
  try {
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

    try {
      logEvent({
        event: 'Reminders- Create Reminder',
        props: {
          Label: label
        }
      });
    } catch (err) {
      console.log(err);
    }

    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const updateReminder = async ({
  userId,
  id,
  status
}: {
  userId: string;
  id: number;
  status: number;
}) => {
  try {
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
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const deleteReminder = async ({ userId, id }: { userId: string; id: number }) => {
  try {
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
  } catch (err) {
    console.log(err);
    return {};
  }
};
