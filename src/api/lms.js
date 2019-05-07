/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { LMSSchools } from '../types/models';
import { getToken } from './utils';

export const getLMSSchools = async (): Promise<LMSSchools> => {
  const token = await getToken();
  const result = await axios.get(API_ROUTES.CANVAS_SCHOOLS, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  const { schools = [] } = data;
  return schools.map(school => ({
    clientId: String((school.client_id: string) || ''),
    school: String((school.school: string) || ''),
    uri: String((school.uri: string) || '')
  }));
};
